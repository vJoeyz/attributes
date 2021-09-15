import { WritableStore } from '@finsweet/ts-utils';

export const selectedExample = new WritableStore<number | undefined>(undefined);
