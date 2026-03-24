import { ChatInputCommandInteraction, EmbedBuilder, MessageFlagsBitField, SlashCommandBuilder } from 'discord.js';

export const pingCommand = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	execute: async function(interaction: ChatInputCommandInteraction) {
		const sentAt = Date.now();

		const embed = new EmbedBuilder();
		embed
			.setTitle('Pong!')
			// .setThumbnail('https://tenor.com/view/skeleton-dance-dancing-moves-gif-4650386')
			.setImage('https://media.tenor.com/gFnNt0YFwo0AAAAM/%D1%83%D0%BC%D0%BD%D1%8B%D0%B9-%D1%83%D0%BC%D0%BD%D0%BE.gif')
			.setDescription(`<@${interaction.user.id}>`);

		await interaction.reply({
			embeds: [embed],
			flags: MessageFlagsBitField.Flags.Ephemeral,
		});

		const responseTime = Date.now() - sentAt;

		embed
			.setTitle('Response time')
			.addFields(
				{
					name: 'Gateway ping',
					value: `${interaction.client.ws.ping} ms`,
					inline: true,
				},
				{
					name: 'Response time',
					value: `${responseTime} ms`,
					inline: true,
				},
			);

		await interaction.editReply({
			embeds: [embed],
		});
	},
};