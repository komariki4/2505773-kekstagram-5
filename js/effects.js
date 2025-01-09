const Effect = {
  DEFAULT: 'none',
  CHROME: 'chrome',
  SEPIA: 'sepia',
  MARVIN: 'marvin',
  PHOBOS: 'phobos',
  HEAT: 'heat',
};

const ALERT_SHOW_TIME = 5000;
const RERENDER_DELAY = 500;

const alertContainer = document.createElement('div');
const modalElement = document.querySelector('.img-upload');
const imageElement = modalElement.querySelector('.img-upload__preview img');
const effectsElement = modalElement.querySelector('.effects');
const sliderElement = modalElement.querySelector('.effect-level__slider');
const sliderContainerElement = modalElement.querySelector('.img-upload__effect-level');

const effectLevelElement = modalElement.querySelector('.effect-level__value');

const effectToFilter = {
  [Effect.CHROME]: {
    style: 'grayscale',
    unit: '',},
  [Effect.SEPIA]: {
    style: 'sepia',
    unit: '',},
  [Effect.MARVIN]: {
    style: 'invert',
    unit: '%',},
  [Effect.HEAT]: {
    style: 'brightness',
    unit: '',},
  [Effect.PHOBOS]: {
    style: 'blur',
    unit: 'px',},
};

const effectToSliderOptions = {
  [Effect.DEFAULT]: {
    min: 0,
    max: 100,
    step: 1,},
  [Effect.CHROME]: {
    min: 0,
    max: 1,
    step: 0.1,},
  [Effect.SEPIA]: {
    min: 0,
    max: 1,
    step: 0.1,},
  [Effect.MARVIN]: {
    min: 0,
    max: 100,
    step: 1,},
  [Effect.PHOBOS]: {
    min: 0,
    max: 3,
    step: 0.1,},
  [Effect.HEAT]: {
    min: 0,
    max: 3,
    step: 0.1,},
};

let chosenEffect = Effect.DEFAULT;

const isDefault = () => chosenEffect === Effect.DEFAULT;

const setImageStyle = () => {
  if (isDefault()) {
    imageElement.style.filter = null;
    return;
  }
  const {value} = effectLevelElement;
  const {style, unit} = effectToFilter[chosenEffect];
  imageElement.style.filter = `${style}(${value}${unit})`;
};

const onSliderUpd = () => {
  effectLevelElement.value = sliderElement.noUiSlider.get();
  setImageStyle();
};

const showSlider = () => sliderContainerElement.classList.remove('hidden');

const hideSlider = () => sliderContainerElement.classList.add('hidden');

const createSlider = ({ min, max, step }) => {
  noUiSlider.create(sliderElement, {
    range: { min, max },
    step,
    start: max,
    connect: 'lower',
    format: {
      to: (value) => Number(value),
      from: (value) => Number(value),
    }
  });
  sliderElement.noUiSlider.on('update', onSliderUpd);
  hideSlider();
};

const updateSlider = ({ min, max, step }) => {
  sliderElement.noUiSlider.updateOptions({
    range: {min, max},
    step,
    start: max,
  });
};

const setSlider = () => {
  if (isDefault()) {
    hideSlider();
  } else {
    updateSlider(effectToSliderOptions[chosenEffect]);
    showSlider();
  }
};

const setEffect = (result) => {
  chosenEffect = result;
  setSlider();
  setImageStyle();
};

const resetEffect = () => setEffect(Effect.DEFAULT);

setTimeout(() => {
  alertContainer.remove();
}, ALERT_SHOW_TIME);

const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const onEffectsChange = debounce((evt) => setEffect(evt.target.value), RERENDER_DELAY);

let sliderCreated = false;

const initEffect = () => {
  if (!sliderCreated) {
    createSlider(effectToSliderOptions[chosenEffect]);
    sliderCreated = true;
    effectsElement.addEventListener('change', onEffectsChange);
  }
};


export {resetEffect, initEffect};
