import { Schema, model } from 'mongoose';

export const UserSchema = new Schema({
	discordID: {
		type: String,
		unique: true,
		required: true,
	},
	balance: {
		type: Number,
		required: true,
		default: 0,
	},
}, { timestamps: true });

export const userModel = model('Users', UserSchema);