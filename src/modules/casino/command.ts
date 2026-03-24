import { ChatInputCommandInteraction, MessageFlagsBitField, SlashCommandBuilder } from 'discord.js';
import { getRandomFruitEmoji } from './fruits.js';

const input = 'bet';

export const casinoCommand = {
	data: new SlashCommandBuilder()
		.setName('casino')
		.setDescription('spend money')
		.addIntegerOption((integer) => {
			return integer
				.setName(input)
				.setDescription('Bet value')
				.setRequired(true);
		}),
	execute: async function(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			content: `${getRandomFruitEmoji()}`,
			flags: MessageFlagsBitField.Flags.Ephemeral,
		});
	},
};