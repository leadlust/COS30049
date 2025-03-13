import { Request, Response } from 'express';
import axios from 'axios';
import Rate from '../models/rateModel';

export const convertCurrency = async (req: Request, res: Response) => {
    try {
        const { from, to, amount } = req.query;
        const fromRate = await Rate.findOne({ currency: from });
        const toRate = await Rate.findOne({ currency: to });

        if (!fromRate || !toRate) return res.status(404).json({ message: 'Currency not found' });

        const result = (Number(amount) / fromRate.rate) * toRate.rate;
        res.json({ result });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to update rates using an external API
export const updateRates = async () => {
    try {
        const response = await axios.get('https://openexchangerates.org/api/latest.json?app_id=YOUR_API_KEY');
        const rates = response.data.rates;
        for (const currency in rates) {
            await Rate.updateOne({ currency }, { rate: rates[currency] }, { upsert: true });
        }
    } catch (error) {
        console.error('Error updating rates:', error);
    }
};