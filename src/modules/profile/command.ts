import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder, Colors } from 'discord.js';

const selectedUser: string = 'target';

export const profileCommand = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('sends profile')
		.addUserOption((user) => {
			return user
				.setName(selectedUser)
				.setDescription('User name')
				.setRequired(true);
		}),
	execute: async function(interaction: ChatInputCommandInteraction) {
		const targetUser = interaction.options.getUser(selectedUser, true);

		const embed = new EmbedBuilder();
		embed.setTitle(targetUser.displayName)
			.addFields(
				{ name: 'ID', value: targetUser.id, inline: false },
				{ name: 'Global Name', value: targetUser.globalName ?? '', inline: false },
			)
			.setColor(Colors.Aqua)
			.setImage(targetUser.displayAvatarURL());

		await interaction.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	},
};