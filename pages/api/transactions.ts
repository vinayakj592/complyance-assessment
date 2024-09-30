import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const client = await clientPromise
  const db = client.db()

  if (req.method === 'GET') {
    try {
      const transactions = await db
        .collection('transactions')
        .find({ userEmail: session.user.email })
        .sort({ createdAt: -1 })
        .toArray()
      res.status(200).json(transactions)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' })
    }
  } else if (req.method === 'POST') {
    try {
      const { amount, description, category } = req.body
      const newTransaction = {
        amount: parseFloat(amount),
        description,
        category,
        userEmail: session.user.email,
        createdAt: new Date(),
        status: 'pending',
      }
      const result = await db.collection('transactions').insertOne(newTransaction)
      res.status(201).json({ ...newTransaction, _id: result.insertedId })
    } catch (error) {
      res.status(500).json({ error: 'Failed to add transaction' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
