import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID = '', DEV_ID = '' } = process.env;

switch (true) {
case MONGO_URI == null:
	throw new Error('Missing MONGODB_URI environment');

case DISCORD_TOKEN == null:
	throw new Error('Missing DISCORD_TOKEN environment');

case DISCORD_CLIENT_ID == null:
	throw new Error('Missing DISCORD_CLIENT_ID environment');

case GUILD_ID == null:
	throw new Error('Missing GUILD_ID environment');

case DEV_ID == null:
	throw new Error('Missing DEV_ID environment');
}
export const config = {
	MONGO_URI: MONGO_URI,
	DISCORD_TOKEN: DISCORD_TOKEN,
	CLIENT_ID: DISCORD_CLIENT_ID,
	GUILD_ID: GUILD_ID
		.split(',')
		.map(id => id.trim())
		.filter(id => id.length > 0),
	DEV_ID: DEV_ID
		.split(',')
		.map(id => id.trim())
		.filter(id => id.length > 0),
};