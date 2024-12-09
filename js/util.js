export const onDocumentKeydown = (closingFunc) => function (evt) {
  if (evt.key === 'Escape') {
    closingFunc(evt);
  }
};
