import { REST, Routes } from 'discord.js';
import { config } from '../config/env.js';
import { commands } from '../modules/commands.js';

const commandsData = Object.values(commands).map(command => command.data.toJSON());

const rest = new REST().setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
	console.log('Deploying commands...');

	for (const e of config.GUILD_ID) {
		const guildId = e;

		console.log(`Deploying to guild ${guildId}...`);

		await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, guildId),
			{
				body: commandsData,
			},
		);
	}
}