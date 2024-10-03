import { useState } from "react";
import { register } from "../services/auth.service.js";

import PasswordInput from "./Inputs/passwordInput.jsx";
import EmailInput from "./Inputs/EmailInput.jsx";
import NameInput from "./Inputs/NameInput.jsx";

const RegisterForm = ({ toggleForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordIsValid = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordIsValid(password)) {
      setError(
        "Password must contain at least 8 characters, an uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      await register(name, email, password);
      setError("");
      setSuccess("Successful! Redirecting to login page...");
      setTimeout(() => {
        toggleForm();
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-11 w-96 mx-auto px-5 py-10 rounded-lg h-[70vh] text-black">
        <h1 className="text-center font-bold text-3xl mt-5">Register</h1>
        <NameInput name={name} setName={setName} />
        <EmailInput email={email} setEmail={setEmail} />
        <PasswordInput password={password} setPassword={setPassword} />
        <PasswordInput
          password={confirmPassword}
          setPassword={setConfirmPassword}
          prompt="Confirm Password"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!name || !email || !password || !confirmPassword}
          className="px-10 py-3 bg-blue-500 rounded-3xl cursor-pointer bg-gradient-to-r from-blue-700 to-white-200 font-bold text-white mt-5 shadow-xl"
        >
          REGISTER
        </button>
        {success && (
          <p className="text-green-500 text-center mt-3">{success}</p>
        )}
        {error && (
          <p className="text-red-500 text-center mt-2 mt-md-3">{error}</p>
        )}
        <p className="text-center relative top-[2rem] text-white">
          Already have an account?{" "}
          <span onClick={toggleForm} className="font-bold cursor-pointer ">
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
