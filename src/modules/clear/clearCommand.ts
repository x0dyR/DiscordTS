import {
	ChatInputCommandInteraction, Collection,
	EmbedBuilder, Message,
	MessageFlagsBitField,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';

const MAX_DELETE_COUNT = 100;

const clearOptionInput = 'count';
const selectUserInput = 'user';
const botClearMessagesInput = 'bot';

export const clearCommand = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('clears messages')
		.addIntegerOption(option => {
			return option
				.setName(clearOptionInput)
				.setDescription('Count of messages to be deleted')
				.setRequired(true);
		})
		.addUserOption(option => {
			return option
				.setName(selectUserInput)
				.setDescription('Select user to delete messages')
				.setRequired(false);
		})
		.addBooleanOption(option => {
			return option
				.setName(botClearMessagesInput)
				.setDescription('Clear messages from bots')
				.setRequired(false);
		}),
	execute: async function(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: MessageFlagsBitField.Flags.Ephemeral });
		if (interaction.guild == null) return;
		if (interaction.channel == null) return;
		if (interaction.channel.isTextBased() == false) return;
		if (interaction.channel instanceof TextChannel == false) return;
		// await interaction.reply({
		// 	embeds: [new EmbedBuilder()
		// 		.setImage('https://media.discordapp.net/attachments/1243196003029618808/1486000972382867496/--.gif?ex=69c3e9c0&is=69c29840&hm=2b0be39ec1c82a053adec66d4424577ee0ac6176f1fe474788359b6d4cd7760f&=')
		// 		.setThumbnail('https://media.discordapp.net/attachments/1243196003029618808/1486004330170417315/papich100x100.gif?ex=69c3ece0&is=69c29b60&hm=70f3735e7c3f51c95b73046837e37319f56f58c4997aa69ade33e0f5e76e1272&=')],
		// 	flags: MessageFlagsBitField.Flags.Ephemeral,
		// });
		const fetchedMessages = await fetchMessages(interaction.channel, interaction.options.getInteger(clearOptionInput, true));
		console.log(...fetchedMessages.values());

		await interaction.editReply({
			embeds: [new EmbedBuilder()
				.setDescription(`collected ${fetchedMessages.length} messages`)],
		});
		/* const deletedMessages = */
		// await interaction.channel.bulkDelete(1, true);
	},
};

async function fetchMessages(channel: TextChannel, limit: number) {
	const collected = [];
	let lastId;

	while (collected.length < limit) {
		const batch: Collection<string, Message<true>> = await channel.messages.fetch({
			limit: Math.min(MAX_DELETE_COUNT, limit - collected.length),
			...(lastId ? { before: lastId } : {}),
		});

		if (batch.size == 0) break;

		collected.push(...batch.values());
		lastId = batch.last()?.id;

		if (batch.size < MAX_DELETE_COUNT) break;
	}
	return collected;
}