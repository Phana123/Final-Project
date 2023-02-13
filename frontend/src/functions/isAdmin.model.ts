const isAdmin = (string: string, arr: string[]) => {
  let isTrue: boolean = false;
  arr?.forEach((value, index) => {
    if (string === value) {
      isTrue = true;
    }
  });
  return isTrue;
};
export default isAdmin;
