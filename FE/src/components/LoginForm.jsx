import { useState } from "react";
import { login } from "../services/auth.service.js";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./Inputs/passwordInput.jsx";
import EmailInput from "./Inputs/EmailInput.jsx";

const LoginForm = ({ toggleForm, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res?.accessToken) {
        localStorage.setItem("user", res.name);
        localStorage.setItem("accessToken", res.accessToken);
        setUser(res.name);
        navigate("/");
        return;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-100">
      <form
        className="flex flex-col gap-12 w-96 mx-auto px-5 py-20 rounded-lg  h-[70vh]"
        onSubmit={handleLogin}
      >
        <h1 className="text-center font-bold text-3xl mb-10">Sign In</h1>
        <div>
          <EmailInput email={email} setEmail={setEmail} />
        </div>
        <div>
          <PasswordInput password={password} setPassword={setPassword} />
        </div>
        <button
          type="submit"
          className="px-10 py-3 bg-blue-500 rounded-3xl cursor-pointer bg-gradient-to-r from-blue-700 to-white-200 font-bold text-white shadow-xl"
          disabled={!email || !password}
        >
          LOGIN
        </button>
        {error && <p className="text-center text-red-500">{error}</p>}
        <p className="text-center relative top-[100px] text-white">
          Dont have an account?{" "}
          <span onClick={toggleForm} className="font-bold cursor-pointer">
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
