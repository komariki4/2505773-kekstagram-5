import { onDocumentKeydown } from './util.js';
import { MAX_HASHTAGS_COUNT, MAX_DESCRIPTION_LENGTH } from './data.js';
import {resetEffect, initEffect} from './effects.js';
import {resetScale} from './scale.js';
import {sendData} from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const imageOverlay = uploadForm.querySelector('.img-upload__overlay.hidden');
const closeButton = uploadForm.querySelector('.img-upload__cancel');
const image = uploadForm.querySelector('.img-upload__preview img');
const hashtagsField = uploadForm.querySelector('.text__hashtags');
const descriptionField = uploadForm.querySelector('.text__description');
const submitBtn = uploadForm.querySelector('#upload-submit');

const validationForm = /^#[0-9a-zа-яё]{1,19}$/i;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload--invalid',
  successClass: 'img-upload--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error'
});


uploadInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      image.src = reader.result;
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
    if (!validationForm.test(element)) {
      return false;
    }
  }
  return true;
};

pristine.addValidator(
  hashtagsField,
  validateHashtagsCount,
  'Максимальное количество хэштегов - 5'
);

pristine.addValidator(
  hashtagsField,
  validateHashtagsUniqueness,
  'Не должно быть повторяющихся хэштегов'
);

pristine.addValidator(
  hashtagsField,
  validHashtages,
  'Ошибка хештега'
);

const validateDescription = (value) => value.trim().length <= MAX_DESCRIPTION_LENGTH;

pristine.addValidator(
  descriptionField,
  validateDescription,
  'Описание не может быть больше 140 символов'
);

function resetForm() {
  resetEffect();
  resetScale();
  uploadForm.reset();
}

function closeOverlay(){
  imageOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  closeButton.removeEventListener('click', () => {
    resetForm(); closeOverlay();
  });
  document.removeEventListener('keydown', onDocumentKeydown(closeOverlay));
  uploadInput.addEventListener('click', openOverlay);
  uploadInput.value = null;
  hashtagsField.textContent = '';
  descriptionField.textContent = '';
  submitBtn.removeAttribute('disabled');
}

function openOverlay() {
  initEffect();
  imageOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  closeButton.addEventListener('click', () => {
    resetForm(); closeOverlay();
  });
  document.addEventListener('keydown', onDocumentKeydown(closeOverlay));
  uploadInput.removeEventListener('click', openOverlay);
}

uploadInput.addEventListener('change', openOverlay);

hashtagsField.addEventListener('input', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    submitBtn.setAttribute('disabled', 'true');
  }else{
    submitBtn.removeAttribute('disabled');
  }
});

descriptionField.addEventListener('input', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    submitBtn.setAttribute('disabled', 'true');
  }else{
    submitBtn.removeAttribute('disabled');
  }
});


uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);
  submitBtn.setAttribute('disabled', 'true');
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
