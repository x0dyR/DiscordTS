import { Client, Events, GuildMember, IntentsBitField } from 'discord.js';
import { config } from '../config/env.js';
import { deployCommands } from './deploy-commands.js';
import { commands } from '../modules/commands.js';
import { connect } from '../infrastructure/db/connect.js';
import { guildMemberAddEvent } from '../modules/users/registerNewbies.js';

console.clear();

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildInvites,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.GuildMessagePolls,
		IntentsBitField.Flags.GuildModeration,
		IntentsBitField.Flags.GuildExpressions,
		IntentsBitField.Flags.GuildMessageReactions,
	],
});

await connect();

client.once(Events.ClientReady, async () => {
	console.log('DEVS:\n');
	for (let i = 0; i < config.DEV_ID.length; i++) {
		const guild = await client.guilds.fetch(config.GUILD_ID);

		const devID = config.DEV_ID[i];
		const member = await guild.members.fetch(devID);
		console.log(`name: ${member.displayName}, nickname: ${member.user.username}`);
	}

	console.log('\n\nBot ready');
	await deployCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand() == false) return;

	const commandName = interaction.commandName;
	const command = commands[commandName as keyof typeof commands];
	await command.execute(interaction);

	if (interaction.inGuild() && interaction.member instanceof GuildMember) {
		await guildMemberAddEvent(interaction.member);
	}
});

// client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
// 	await guildMemberAddEvent(member);
// });

client.login(config.DISCORD_TOKEN);