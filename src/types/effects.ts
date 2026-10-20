
export interface BaseEffect {
    /** Hex color code */
    color: string;

    /** from 0.0 (off) to 1.0 (full) */
    opacity: number;

    /** duration in ms */
    duration:  number;
}

type EffectType = 'On' | 'Selection' | 'Rainbow' | 'Strobe' | 'Pulse';

export interface StandardEffect extends BaseEffect {
    /** standard effects */
    type: EffectType;

    /** set of colors */
    pallete: string[];
}