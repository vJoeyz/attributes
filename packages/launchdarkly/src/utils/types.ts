import type { Infer } from 'superstruct';

import type { jsonFlagValueSchema } from './constants';

export type JSONFlagValue = Infer<typeof jsonFlagValueSchema>;
