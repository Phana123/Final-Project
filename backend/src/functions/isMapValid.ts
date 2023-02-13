const isMapValid = (string: string, arr: Array<string>) => {
  let isTrue: boolean = false;
  arr.forEach((value, index) => {
    if (string === value) {
      isTrue = true;
    }
  });
  return isTrue;
};
export default isMapValid;