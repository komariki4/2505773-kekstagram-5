function checkMaxString (string, maxLength) {
  return string.length <= maxLength;
}

function isPalindromeString(string) {
  const newString = String.toLowerCase();
  return newString === newString.split('').reverse().join('');
}

