import { REST, Routes } from 'discord.js';
import { config } from '../config/env.js';
import { commands } from '../modules/commands.js';

const commandsData = Object.values(commands).map(command => command.data.toJSON());

const rest = new REST().setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
	console.log('Deploying commands...');

	for (let i = 0; i < config.GUILD_ID.length; i++) {
		const guildId = config.GUILD_ID[i];

		console.log(`Deploying to guild ${guildId}...`);

		await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, guildId),
			{
				body: commandsData,
			},
		);

		console.log(`Commands deployed to guild ${guildId}`);
	}
}