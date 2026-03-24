import { GuildMember } from 'discord.js';
import { userModel } from './usersSchema.js';

export async function guildMemberAddEvent(member: GuildMember) {
	return userModel.findOneAndUpdate(
		{
			discordID: member.id,
		},
		{
			$setOnInsert: {
				discordID: member.id,
				balance: 0,
			},
		},
		{
			upsert: true,
			returnDocument: 'after',
		},
	);
}