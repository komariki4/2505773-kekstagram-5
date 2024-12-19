import {getPhotoArray} from './data.js';
import {openPicture} from './openBigPic.js';
import {debounce} from './util.js';

const MAX_PHOTOS = 10;
const DEBOUNCE_TIME = 500;

const renderCards = (posts) => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureTemplate = document
    .querySelector('#picture')
    .content.querySelector('.picture');
  picturesContainer.querySelectorAll('.picture').forEach((p) => p.remove());
  const picturesFragment = document.createDocumentFragment();
  posts.forEach(({url, description, likes, comments}) => {
    const picture = pictureTemplate.cloneNode(true);
    picture.querySelector('img').src = url;
    picture.querySelector('img').alt = description;
    picture.querySelector('.picture__likes').textContent = likes;
    picture.querySelector('.picture__comments').textContent = comments.length;
    picture.addEventListener('click', (evt) => {
      openPicture(evt, url, description, likes, comments);
    });
    picturesFragment.append(picture);
  });
  picturesContainer.append(picturesFragment);
};

const toggleActiveClass = (evt) => {
  const filterButtons = document.querySelectorAll('.img-filters__button');
  filterButtons.forEach((button) => button.classList.remove('img-filters__button--active'));
  evt.target.classList.add('img-filters__button--active');
};

const onFilterDefaultClick = debounce((posts, event) => {
  toggleActiveClass(event);
  renderCards(posts);
}, DEBOUNCE_TIME);

const onFilterRandomClick = debounce((posts, event) => {
  toggleActiveClass(event);
  const randomPhotos = posts
    .toSorted(() => Math.random() - 0.5)
    .slice(0, MAX_PHOTOS);
  renderCards(randomPhotos);
}, DEBOUNCE_TIME);

const onFilterDiscussedClick = debounce((posts, event) => {
  toggleActiveClass(event);
  const discussedPhotos = posts.toSorted((a, b) => b.comments.length - a.comments.length);
  renderCards(discussedPhotos);
}, DEBOUNCE_TIME);


export const renderGallery = async () => {
  const imgFilters = document.querySelector('.img-filters');
  const filterDefault = imgFilters.querySelector('#filter-default');
  const filterRandom = imgFilters.querySelector('#filter-random');
  const filterDiscussed = imgFilters.querySelector('#filter-discussed');
  try {
    const posts = await getPhotoArray();
    renderCards(posts);
    imgFilters.classList.remove('img-filters--inactive');
    filterDefault.addEventListener('click', (e) => onFilterDefaultClick(posts, e));
    filterRandom.addEventListener('click', (e) => onFilterRandomClick(posts, e));
    filterDiscussed.addEventListener('click', (e) => onFilterDiscussedClick(posts, e));
  } catch (err) {
    const errorBlock = document.createElement('div');
    const errorMessage = document.createElement('pre');
    errorBlock.textContent = 'Произошла ошибка при загрузке данных';
    errorMessage.textContent = err;
    errorMessage.style.fontSize = '16px';
    errorBlock.style.fontSize = '20px';
    errorBlock.style.textAlign = 'center';
    errorBlock.style.marginTop = '20px';
    errorBlock.style.border = '1px solid red';
    errorBlock.style.padding = '10px';
    errorBlock.style.borderRadius = '10px';
    errorBlock.style.background = 'rgba(255, 0, 0, 0.25)';
    errorBlock.append(errorMessage);
    document.querySelector('.img-upload').append(errorBlock);
  }

};
