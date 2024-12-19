const SERVER_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

export const fetchData = () => fetch(`${SERVER_URL}/data`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.status.toString());
    }
  })
  .catch((error) => {
    throw new Error(error);
  });

export const sendData = (data, onSuccess, onError) => {
  fetch(SERVER_URL, {
    method: 'POST',
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status.toString());
      }
    })
    .then((d) => {
      onSuccess(d);
    })
    .catch((error) => {
      onError(error);
    });
};
