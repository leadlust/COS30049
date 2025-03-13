import { Schema, model } from 'mongoose';

const walletSchema = new Schema({
    address: { type: String, required: true, unique: true },
    balance: { type: Number, required: true }
});

export default model('Wallet', walletSchema);