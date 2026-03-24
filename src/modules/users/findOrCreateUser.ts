import { userModel } from './usersSchema.js';

export async function findOrCreateUser(discordID: string) {
	return userModel.findOneAndUpdate(
		{
			discordID,
		},
		{
			$setOnInsert: {
				discordID,
				balance: 0,
			},
		},
		{
			upsert: true,
			returnDocument: 'after',
		},
	);
}