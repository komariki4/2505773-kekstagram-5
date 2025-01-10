export const onDocumentKeydown = (closingFunc) => function (evt) {
  if (evt.key === 'Escape') {
    closingFunc(evt);
  }
};

export const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    const wait = () => {
      timeout = null;
    };
    const callNow = !timeout;
    if (callNow) {
      func.apply(this, args);
      clearTimeout(timeout);
      timeout = setTimeout(wait, delay);
    }
  };
};

