/* eslint-disable react/prop-types */
import { useState } from "react";
import { changePassword } from "../services/auth.service";
import regexCheck from "../utils/passwordRegex.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineStop } from "react-icons/ai";

const PasswordChangeModal = ({ closeModal }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regexCheck(newPassword)) {
      setError(
        "Password must contain at least 8 characters, an uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
    try {
      await changePassword(password, newPassword);
      setError("");
      setSuccess("Password Changed Successfully. Redirecting...");
      setTimeout(() => {
        closeModal();
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center absolute w-[60rem]">
      <div className="bg-gray-400 w-2/4 rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AiOutlineStop
            className="cursor-pointer text-red-500"
            onClick={() => closeModal()}
          />
          <div>
            <label htmlFor="oldPassword">Password:</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></input>
          </div>
          <div>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></input>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!password || !newPassword}
          >
            Change!
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
