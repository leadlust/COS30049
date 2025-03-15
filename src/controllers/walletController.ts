import { Request, Response } from 'express';
import Wallet from '../models/walletModel';

export const getWallet = async (req: Request, res: Response) => {
    try {
        const wallet = await Wallet.findOne({ address: req.params.address });
        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const addWallet = async (req: Request, res: Response) => {
    try {
        const { address, balance } = req.body;
        const newWallet = new Wallet({ address, balance });
        await newWallet.save();
        res.status(201).json(newWallet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};