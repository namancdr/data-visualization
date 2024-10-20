import { NextApiRequest, NextApiResponse } from 'next';
import { getFilteredData } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ageGroup, gender, startDate, endDate } = req.body;

  try {
    const data = await getFilteredData(ageGroup, gender, startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error('Data fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
}