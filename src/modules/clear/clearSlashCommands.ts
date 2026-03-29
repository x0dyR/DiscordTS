import { REST, Routes } from 'discord.js';
import { config } from '../../config/env.js';

const rest = new REST().setToken(config.DISCORD_TOKEN);

for (let i = 0; i < config.GUILD_ID.length; i++) {
	const guildId = config.GUILD_ID[i];

	await rest.put(
		Routes.applicationGuildCommands(config.CLIENT_ID, guildId),
		{
			body: [],
		},
	);

	console.log(`Cleared guild commands for ${guildId}`);
}

await rest.put(
	Routes.applicationCommands(config.CLIENT_ID),
	{
		body: [],
	},
);

console.log('Cleared global commands');