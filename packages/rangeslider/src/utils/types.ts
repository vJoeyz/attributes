import type { Handle } from '../components/Handle';
import type { getSettings } from '../actions/settings';

export type HandleInstances = [Handle, Handle | undefined];

export type RangeSliderSettings = NonNullable<ReturnType<typeof getSettings>>;
