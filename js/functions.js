function checkMaxString (string, maxLength) {
  return string.length <= maxLength;
}


checkMaxString('проверяемая строка', 20);
checkMaxString('проверяемая строка', 18);
checkMaxString('проверяемая строка', 10);

function isPalindromeString() {
  const newString = String.toLowerCase();
  return newString === newString.split('').reverse().join('');
}


isPalindromeString('топот');
isPalindromeString('ДовОд');
isPalindromeString('Кекс');
