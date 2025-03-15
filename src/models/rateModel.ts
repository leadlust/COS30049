import { Schema, model } from 'mongoose';

const rateSchema = new Schema({
    currency: { type: String, required: true, unique: true },
    rate: { type: Number, required: true }
});

export default model('Rate', rateSchema);