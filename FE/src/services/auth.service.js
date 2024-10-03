import axios from "axios";
const baseURL = "http://localhost:3000/auth";

export const login = async (email, password) => {
  const URL = `${baseURL}/login`;
  const res = await axios.post(URL, { email, password }).catch((error) => {
    throw new Error(error.response.data.error);
  });
  return res.data;
};

export const register = async (name, email, password) => {
  const URL = `${baseURL}/register`;
  const res = await axios
    .post(URL, { name, email, password })
    .catch((error) => {
      throw new Error(error.response.data.error);
    });
  return res.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }
    const config = {
      headers: {
        "x-access-token": accessToken,
      },
    };
    const res = await axios.patch(
      `${baseURL}/change-password`,
      { oldPassword, newPassword },
      config
    );
    return res.data;
  } catch (error) {
    throw new Error("An error occurred while changing the password");
  }
};
