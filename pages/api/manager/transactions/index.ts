import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import clientPromise from '../../../../lib/mongodb' // Import clientPromise instead of connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || session.user?.role !== 'manager') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Get the MongoDB client and database
  const client = await clientPromise
  const db = client.db() // If you have a specific database name, pass it here, e.g., client.db('your-db-name')

  if (req.method === 'GET') {
    try {
      const transactions = await db
        .collection('transactions')
        .find({})
        .sort({ createdAt: -1 })
        .toArray()
      res.status(200).json(transactions)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
