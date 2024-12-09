import { getPhotoArray } from './data.js';
import { openPicture } from './openBigPicture.js';

export const getRenderedCards = async () => {
  const pictureTemplate = document
    .querySelector('#picture')
    .content.querySelector('.picture');
  const picturesContainer = document.querySelector('.pictures');
  try {
    const posts = await getPhotoArray();
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
  } catch (err) {
    const errorBlock = document.createElement('div');
    const errorMessage = document.createElement('pre');
    errorBlock.textContent = 'Произошла ошибка при загрузке данных с сервера';
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
