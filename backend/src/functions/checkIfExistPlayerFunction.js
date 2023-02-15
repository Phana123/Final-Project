const checkIfExistPlayerFunction = (string, arr) => {
  let isTrue = false;
  arr?.forEach((value, index) => {
    if (string === value.userId.toString()) {
      isTrue = true;
    }
  });
  return isTrue;
};

export { checkIfExistPlayerFunction };