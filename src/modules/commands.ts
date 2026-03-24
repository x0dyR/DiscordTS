import { pingCommand } from './ping/command.js';
import { randomValue } from './randomValue/command.js';
import { casinoCommand } from './casino/command.js';
import { profileCommand } from './profile/command.js';

export const commands = {
	ping: pingCommand,
	salary: randomValue,
	casino: casinoCommand,
	profile: profileCommand,
};