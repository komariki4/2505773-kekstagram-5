import {fetchData} from './api.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_DESCRIPTION_LENGTH = 140;

const SCALE = {
  MIN: 25,
  MAX: 100
};

const SCALE_STEP = 25;

const DEFAULT_SCALE = 100;

export async function getPhotoArray() {
  return fetchData().then((data) => data);
}

export {
  MAX_HASHTAGS_COUNT,
  MAX_DESCRIPTION_LENGTH,
  SCALE,
  SCALE_STEP,
  DEFAULT_SCALE
};
