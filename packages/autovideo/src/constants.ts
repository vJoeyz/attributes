import { AUTO_VIDEO_ATTRIBUTE } from '$global/constants/attributes';
import { type AttributesDefinition, generateSelectors } from '$global/factory';

const ATTRIBUTES_PREFIX = `fs-${AUTO_VIDEO_ATTRIBUTE}`;

export const ATTRIBUTES = {
  element: {
    key: `${ATTRIBUTES_PREFIX}-element`,
    values: {},
  },
} as const satisfies AttributesDefinition;

export const [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
