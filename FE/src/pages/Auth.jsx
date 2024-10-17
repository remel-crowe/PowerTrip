import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import background from "../assets/bg.png";
import logo from "../assets/power.png";

const Auth = ({ setUser }) => {
  const [hasAccount, setHasAccount] = useState(true);

  const toggleHasAccount = () => {
    setHasAccount(!hasAccount);
  };

  return (
    <div
      className="flex h-90 items-center justify-center flex-col gap-0"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img src={logo} alt="logo" />
      {hasAccount ? (
        <LoginForm toggleForm={toggleHasAccount} setUser={setUser} />
      ) : (
        <RegisterForm toggleForm={toggleHasAccount} />
      )}
    </div>
  );
};

export default Auth;
