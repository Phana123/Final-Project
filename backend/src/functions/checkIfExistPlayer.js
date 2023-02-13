

const checkIfExistPlayer = (string, arr) => {
  let isTrue = false;
  arr.forEach((value, index) => {
    console.log(value)
    if (string === value.userId) {
      isTrue = true;
    }
  });
  return isTrue;
};
export default checkIfExistPlayer;
