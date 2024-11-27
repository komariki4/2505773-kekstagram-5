const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_COUNT = 5;
const VALID_HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;

const imgUploadForm = document.querySelector('.img-upload__form');
const imgUploadOverlay = document.querySelector('.img-upload__overlay');
const imgUploadCancel = document.querySelector('.img-upload__cancel');
const textHashtags = document.querySelector('.text__hashtags');
const textDescription = document.querySelector('.text__description');
const body = document.body;

const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

function validateComment(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

pristine.addValidator(
  imgUploadForm.querySelector('.text__description'),
  validateComment,
  'Длина комментария не может составлять больше 140 символов'
);

const splitHashtags = (hashtags) => hashtags.trim().split(/\s+/);

function validateHashtagItems(value) {
  const hashtags = splitHashtags(value);
  const isValidCount = hashtags.length <= MAX_HASHTAG_COUNT;
  const isValidText = hashtags.every((hashtag) => VALID_HASHTAG.test(hashtag));
  const isUnique = hashtags.length === new Set(hashtags.map((hashtag) => hashtag.toLowerCase())).size;

  return {isValidCount, isValidText, isUnique};
}

function validateHashtag(value) {
  const {isValidCount, isValidText, isUnique} = validateHashtagItems(value);
  return isValidCount && isValidText && isUnique;
}

const getHashtagErrorMessage = (value) => {
  const {isValidCount, isValidText, isUnique} = validateHashtagItems(value);

  if (!isValidCount) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }
  if (!isValidText) {
    return 'Строка после решётки должна состоять из букв и чисел и иметь длину не более 20 символов';
  }
  if (!isUnique) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }
  return true;
};

pristine.addValidator(
  imgUploadForm.querySelector('.text__hashtags'),
  validateHashtag,
  getHashtagErrorMessage
);

imgUploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});


const showForm = () => {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeForm = () => {
  imgUploadForm.reset();
  imgUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  const isInputFocused = [textHashtags, textDescription].some((el) => el === evt.target);
  if (evt.key === 'Escape' && !isInputFocused){
    evt.preventDefault();
    closeForm();
  }
}


imgUploadCancel.addEventListener('keydown', onDocumentKeydown);
imgUploadCancel.addEventListener('click', closeForm);
imgUploadForm.addEventListener('change', showForm);
