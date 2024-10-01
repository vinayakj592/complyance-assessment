import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user?.role !== 'manager') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const client = await clientPromise
  const db = client.db()  // If your database has a specific name, use client.db('your-db-name')

  if (req.method === 'PATCH') {
    try {
      const { id } = req.query
      const { action } = req.body

      if (action !== 'approve' && action !== 'reject') {
        return res.status(400).json({ error: 'Invalid action' })
      }

      const result = await db.collection('transactions').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { status: action === 'approve' ? 'approved' : 'rejected' } }
      )

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Transaction not found' })
      }

      res.status(200).json({ message: `Transaction ${action}d successfully` })
    } catch (err) {  // Changed from 'error' to 'err'
      res.status(500).json({ error: `Failed to ${req.body.action} transaction`, details: err instanceof Error ? err.message : 'Unknown error' })
    }
  } else {
    res.setHeader('Allow', ['PATCH'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}