import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const client = await clientPromise
    const db = client.db('complyance')
    const collection = db.collection('transactions')

    if (req.method === 'GET') {
      const transactions = await collection.find({ userEmail: session.user.email }).toArray()
      res.status(200).json(transactions)
    } else if (req.method === 'POST') {
      const { date, amount, description } = req.body
      if (!date || !amount || !description) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      const newTransaction = {
        userEmail: session.user.email,
        date,
        amount: parseFloat(amount),
        description,
        createdAt: new Date(),
      }
      const result = await collection.insertOne(newTransaction)
      res.status(201).json(result)
    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}