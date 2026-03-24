import { setTimeout } from 'timers/promises';
import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js';

export const randomValue = {
	data: new SlashCommandBuilder()
		.setName('salary')
		.setDescription('sends your salary'),
	execute: async function(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		await setTimeout(5000);
		await interaction.editReply({
			content: `Ваша зарплата: ${Math.floor(Math.random() * 100) + 1}`,
		});

		if (interaction.member == null) throw new Error('Invalid member or member is required');
	},
};