import mongoose from 'mongoose';
import { config } from '../../config/env.js';

export async function connect() {
	const db = await mongoose.connect(config.MONGO_URI);

	if (db.connection.readyState != 1) {
		throw new Error('connection error');
	}
}