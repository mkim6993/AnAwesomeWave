export interface BaseEffect {
  /** Hex color code */
  color: string;

  /** from 0.0 (off) to 1.0 (full) */
  opacity: number;

  /** duration in ms */
  duration?: number | typeof Infinity;
}

export type EffectType =
  | 'Solid-One' // one solid color, duration(X)
  | 'Solid-Multiple' // random color in palette, duration(X)
  | 'Cycle-Multiple' // cycle through random colors in palette
  | 'Rainbow' // random color in rainbow palette
  | 'Strobe' // quick flashes of color in palette
  | 'Pulse';

export interface StandardEffect extends BaseEffect {
  /** standard effects */
  type: EffectType;

  /** set of colors */
  palette: string[];
}
