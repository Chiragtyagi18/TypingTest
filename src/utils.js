export const calculateWPM = (inputValue, currentText, elapsedSeconds) => {
  let correctChars = 0;
  for (let i = 0; i < inputValue.length; i++) {
    if (inputValue[i] === currentText[i]) correctChars++;
  }
  const wordsTyped = correctChars / 5;
  const minutes = elapsedSeconds / 60;
  return minutes > 0 ? wordsTyped / minutes : 0;
};

export const calculateAccuracy = (inputValue, currentText) => {
  if (inputValue.length === 0) return 100;
  let correctChars = 0;
  for (let i = 0; i < inputValue.length; i++) {
    if (inputValue[i] === currentText[i]) correctChars++;
  }
  return (correctChars / inputValue.length) * 100;
};

export const chooseRandomText = (texts) => {
  return texts[Math.floor(Math.random() * texts.length)];
};
