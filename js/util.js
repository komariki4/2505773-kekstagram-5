export const onDocumentKeydown = (closingFunc) => function (evt) {
  if (evt.key === 'Escape') {
    closingFunc(evt);
  }
};

export const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

