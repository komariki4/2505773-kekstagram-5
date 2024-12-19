import { onDocumentKeydown } from './util.js';

const commentTemplate = document.querySelector('.social__comment');
const commentsLoader = document.querySelector('.comments-loader');

const showNextComments = () => {
  let currentComment = document.querySelector('.social__comment.hidden');
  let i = 0;

  for (; i < 5; i++) {
    if (currentComment === null) {
      commentsLoader.classList.add('hidden');
      break;
    }
    currentComment.classList.remove('hidden');
    currentComment = currentComment.nextElementSibling;
    if (currentComment === null) {
      commentsLoader.classList.add('hidden');
      document.querySelector('.loaded-comments-count').textContent =
        +document.querySelector('.loaded-comments-count').textContent + 1;
      break;
    }
  }
  document.querySelector('.loaded-comments-count').textContent =
    +document.querySelector('.loaded-comments-count').textContent + i;
};

const loadAllComments = (commentsContainer, comments) => {
  const commentsFragment = document.createDocumentFragment();
  for (let i = 0; i < comments.length; ++i) {
    const comment = commentTemplate.cloneNode(true);
    comment.querySelector('.social__picture').src = comments[i].avatar;
    comment.querySelector('.social__picture').alt = comments[i].name;
    comment.querySelector('.social__text').textContent = comments[i].message;
    comment.classList.add('hidden');
    commentsFragment.append(comment);
  }
  commentsContainer.innerHTML = '';
  commentsContainer.append(commentsFragment);
};

function openPicture(evt, url, description, likes, comments) {
  const openedPicture = document.querySelector('.big-picture');
  openedPicture.classList.remove('hidden');
  openedPicture.querySelector('.big-picture__img img').src = url;
  openedPicture.querySelector('.likes-count').textContent = likes;
  openedPicture.querySelector('.comments-count').textContent = comments.length;
  openedPicture.querySelector('.social__caption').textContent = description;
  openedPicture.querySelector('.loaded-comments-count').textContent = '0';

  const commentsContainer = document.querySelector('.social__comments');
  loadAllComments(commentsContainer, comments);
  showNextComments();

  document.body.classList.add('modal-open');

  openedPicture
    .querySelector('.big-picture__cancel')
    .addEventListener('click', closePicture);
  document.addEventListener('keydown', onDocumentKeydown(closePicture));

  openedPicture
    .querySelector('.social__comments-loader')
    .addEventListener('click', showNextComments);
}

function closePicture(evt) {
  document.body.classList.remove('modal-open');
  document.querySelector('.big-picture').classList.add('hidden');
  evt.target.removeEventListener('click', closePicture);
  document.removeEventListener('keydown', onDocumentKeydown(closePicture));
  document
    .querySelector('.social__comments-loader')
    .removeEventListener('click', showNextComments);
  commentsLoader.classList.remove('hidden');
}

export { openPicture };
