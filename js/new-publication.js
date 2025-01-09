import { onDocumentKeydown } from './util.js';
import { MAX_HASHTAGS_COUNT, MAX_DESCRIPTION_LENGTH } from './data.js';
import {resetEffect, initEffect} from './effects.js';
import {resetScale} from './scale.js';
import {sendData} from './api.js';

const uploadFormElement = document.querySelector('.img-upload__form');
const uploadInputElement = uploadFormElement.querySelector('.img-upload__input');
const imageOverlayElement = uploadFormElement.querySelector('.img-upload__overlay.hidden');
const closeButtonElement = uploadFormElement.querySelector('.img-upload__cancel');
const imageElement = uploadFormElement.querySelector('.img-upload__preview img');
const hashtagsFieldElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionFieldElement = uploadFormElement.querySelector('.text__description');
const submitBtnElement = uploadFormElement.querySelector('#upload-submit');

const HASHTAG_REGEXP = /^#[0-9a-zа-яё]{1,19}$/i;

const pristine = new Pristine(uploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload--invalid',
  successClass: 'img-upload--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});


uploadInputElement.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      imageElement.src = reader.result;
    }, false);
    reader.readAsDataURL(file);
  }
});

const validateHashtagsCount = (value) => value.trim().split(' ').length <= MAX_HASHTAGS_COUNT;

const validateHashtagsUniqueness = (value) => {
  const hashtags = value.split(' ');
  const hashTagMap = {};
  for (const element of hashtags) {
    const hashtag = element;
    if (hashtag in hashTagMap) {
      return false;
    }
    hashTagMap[hashtag] = true;
  }
  return true;
};

const validHashtages = (value) => {
  if (value.length === 0) {
    return true;
  }
  const hashtags = value.trim().split(' ');
  for (const element of hashtags) {
    if (!HASHTAG_REGEXP.test(element)) {
      return false;
    }
  }
  return true;
};

pristine.addValidator(
  hashtagsFieldElement,
  validateHashtagsCount,
  'Максимальное количество хэштегов - 5'
);

pristine.addValidator(
  hashtagsFieldElement,
  validateHashtagsUniqueness,
  'Не должно быть повторяющихся хэштегов'
);

pristine.addValidator(
  hashtagsFieldElement,
  validHashtages,
  'Ошибка хештега'
);

const validateDescription = (value) => value.trim().length <= MAX_DESCRIPTION_LENGTH;

pristine.addValidator(
  descriptionFieldElement,
  validateDescription,
  'Описание не может быть больше 140 символов'
);

function resetForm() {
  resetEffect();
  resetScale();
  uploadFormElement.reset();
}

function closeOverlay(){
  imageOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButtonElement.removeEventListener('click', () => {
    resetForm(); closeOverlay();
  });
  document.removeEventListener('keydown', onDocumentKeydown(closeOverlay));
  uploadInputElement.addEventListener('change', openOverlay);
  uploadInputElement.value = null;
  hashtagsFieldElement.textContent = '';
  descriptionFieldElement.textContent = '';
  submitBtnElement.removeAttribute('disabled');
}

function openOverlay() {
  initEffect();
  imageOverlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  closeButtonElement.addEventListener('click', () => {
    resetForm(); closeOverlay();
  });
  document.addEventListener('keydown', onDocumentKeydown(closeOverlay));
  uploadInputElement.removeEventListener('change', openOverlay);
}

uploadInputElement.addEventListener('change', openOverlay);

hashtagsFieldElement.addEventListener('input', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    submitBtnElement.setAttribute('disabled', 'true');
  }else{
    submitBtnElement.removeAttribute('disabled');
  }
});

descriptionFieldElement.addEventListener('input', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    submitBtnElement.setAttribute('disabled', 'true');
  }else{
    submitBtnElement.removeAttribute('disabled');
  }
});


uploadFormElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(uploadFormElement);
  submitBtnElement.setAttribute('disabled', 'true');
  sendData(
    formData,
    () => {
      closeOverlay();
      resetForm();
      openSuccessMessage();
    },
    () => {
      closeOverlay();
      openErrorMessage();
    },
  );
});


function closeSuccessMessage() {
  document.querySelector('.success').remove();
  document.removeEventListener('keydown', onDocumentKeydown(closeSuccessMessage));
}

function openSuccessMessage() {
  document.body.appendChild(document.querySelector('#success').content.cloneNode(true));
  const success = document.querySelector('.success');
  success.children[0].addEventListener('click', (e) => e.stopPropagation());
  success.addEventListener('click', () => {
    success.remove();
  });
  document.addEventListener('keydown', onDocumentKeydown(closeSuccessMessage), true);
  success.querySelector('button').addEventListener('click', () => {
    success.remove();
  });
}

function closeErrorMessage() {
  document.querySelector('.error').remove();
  document.removeEventListener('keydown', onDocumentKeydown(closeErrorMessage));
}

function openErrorMessage() {
  document.body.appendChild(document.querySelector('#error').content.cloneNode(true));
  const error = document.querySelector('.error');
  error.children[0].addEventListener('click', (e) => e.stopPropagation());
  error.addEventListener('click', () => {
    error.remove();
  });
  document.addEventListener('keydown', onDocumentKeydown(closeErrorMessage), true);
  error.querySelector('button').addEventListener('click', () => {
    error.remove();
  });
}
