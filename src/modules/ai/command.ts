import {
	ChatInputCommandInteraction,
	Collection,
	EmbedBuilder, Message,
	MessageFlagsBitField,
	SlashCommandBuilder,
	TextChannel,
} from 'discord.js';

import { Ollama } from 'ollama';

const EMBED_LIMIT = 4096;
const FETCH_MESSAGES_LIMIT = 100;
const userInput = 'request';
const invisibleMessage = 'temporary';
const pickChannel = 'channel';

export const aiCommand = {
	data: new SlashCommandBuilder()
		.setName('ai')
		.setDescription('ai chat')
		.addStringOption(option => {
			return option
				.setName(userInput)
				.setDescription('your message')
				.setRequired(true);
		})
		.addBooleanOption(option => {
			return option
				.setName(invisibleMessage)
				.setDescription('invisible message')
				.setRequired(false);
		})
		.addChannelOption(option => {
			return option
				.setName(pickChannel)
				.setDescription('select channel to collect messages')
				.setRequired(false);
		}),
	execute: async function(interaction: ChatInputCommandInteraction) {
		const currentChannel = interaction.options.getChannel(pickChannel) ?? interaction.channel;
		const isTemporary = interaction.options.getBoolean(invisibleMessage) ?? true;
		const content = interaction.options.getString(userInput, true);

		await interaction.deferReply({
			flags: isTemporary ? MessageFlagsBitField.Flags.Ephemeral : undefined,
		});

		if (currentChannel instanceof TextChannel == false) {
			return;
		}

		const ollama = new Ollama();
		const history = await fetchMessages(currentChannel, 20, interaction.user.id);
		const prompt = buildPrompt(history, content, interaction.user.username, interaction.user.displayName);

		const response = await ollama.chat({
			model: 'gemma2:2b',
			messages: [{
				role: 'user',
				content: prompt,
			}],
		});

		await interaction.editReply({
			embeds: generateEmbeds(response.message.content),
		});
	},
};

function generateEmbeds(message: string): EmbedBuilder[] {
	const embeds: EmbedBuilder[] = [];
	let startIndex = 0;

	while (startIndex < message.length && embeds.length < 10) {
		const chunk = message.slice(startIndex, startIndex + EMBED_LIMIT);

		embeds.push(
			new EmbedBuilder().setDescription(chunk),
		);

		startIndex += EMBED_LIMIT;
	}

	return embeds;
}

async function fetchMessages(channel: TextChannel, limit: number, botUserId: string): Promise<Message[]> {
	const collected: Message[] = [];
	let lastId: string | undefined;

	while (collected.length < limit) {
		const batch: Collection<string, Message<true>> = await channel.messages.fetch({
			limit: Math.min(FETCH_MESSAGES_LIMIT, limit - collected.length),
			...(lastId == undefined ? {} : { before: lastId }),
		});

		if (batch.size == 0) {
			break;
		}

		const messages = [...batch.values()]
			.filter(message => message.author.id != botUserId)
			.filter(message => message.content.length > 0);

		collected.push(...messages);
		lastId = batch.last()?.id;

		if (batch.size < FETCH_MESSAGES_LIMIT) {
			break;
		}
	}

	collected.reverse();
	return collected.slice(0, limit);
}

function buildPrompt(messages: Message[], userRequest: string, requestUsername: string, requestDisplayName: string): string {
	const historyText = messages
		.map(message => `${message.author.username},${message.author.displayName}: ${message.content}`)
		.join('\n');

	return `История переписки:
${historyText}
Запрос пользователя:
Пользователь:${requestUsername}/${requestDisplayName}, ${userRequest}
Ответь строго на русском языке.
Если в истории недостаточно данных, так и напиши.
Не выдумывай факты о человеке.`;
}