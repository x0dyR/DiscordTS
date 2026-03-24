export const Fruit = {
	'🍋': 'Lemon',
	'🍋‍🟩': 'Lime',
	'🫐': 'Blueberry',
	'🥭': 'Mango',
	'🍇': 'Grape',
	'🍉': 'Watermelon',
	'🍍': 'Fa pepe',
	'🍓': 'Strawberry',
	'🍒': 'Cherry',
	'🍏': 'Apple',
	'🍊': 'Orange',
	'🍌': 'Banana',
	'🥝': 'Kiwi',
	'🍑': 'Peach',
	'🍐': 'Pear',
} as const;

export type FruitEmoji = keyof typeof Fruit;
export type FruitName = typeof Fruit[FruitEmoji];
export function getRandomFruitEmoji(): FruitEmoji {
	const fruits = Object.keys(Fruit) as FruitEmoji[];
	const randomIndex = Math.floor(Math.random() * fruits.length);
	return fruits[randomIndex];
}