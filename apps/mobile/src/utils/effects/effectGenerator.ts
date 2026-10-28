import { StandardEffect, type EffectType } from '../../types/effects';

const rainbowPalette = [
	'#FF0000',
	'#FF8000',
	'#FFFF00',
	'#80FF00',
	'#00FF00',
	'#00FF80',
	'#00FFFF',
	'#0080FF',
	'#0000FF',
	'#8000FF',
	'#FF00FF',
	'#FF0080'
];

const generateEffect = (
	type: EffectType,
	palette: string[]=[],
	color: string='#FFFFFF',
	opacity: number=1,
	duration: number
): StandardEffect => {
	const effect: StandardEffect = {
		type,
		palette,
		color,
		opacity,
		duration
	}

	switch (type) {
		/** assign random color from palette */
		case 'Solid-Multiple':
			if (palette.length < 2) throw new Error('Solid-Multiple: You need atleast 2 colors')
			effect.color = palette[Math.floor(Math.random() * palette.length)];

		/** cycle through palette */
		case 'Cycle-Multiple':
			if (palette.length < 2) throw new Error('Cycle-Multiple: You need atleast 2 colors')

		/** cycle through rainbow palette */
		case 'Rainbow':
			effect.palette = rainbowPalette;

		case 'Strobe':
			if (palette.length < 2) throw new Error('Strobe: you need atleast 2 colors');

		default:
			// throw new Error('Unknown Effect type:', type);
	}
	return effect;
}

export default generateEffect;