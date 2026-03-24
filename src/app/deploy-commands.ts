import { REST, Routes } from 'discord.js';
import { config } from '../config/env.js';
import { commands } from '../modules/commands.js';

const commandsData = Object.values(commands).map(command => command.data.toJSON());

const rest = new REST().setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
	console.log('Deploying commands...');
	await rest.put(
		Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
		{
			body: commandsData,
		},
	);
	console.log('commands deployed');
}