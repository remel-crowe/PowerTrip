const regexCheck = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
  return passwordRegex.test(password);
};

export default regexCheck;
