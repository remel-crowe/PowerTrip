import { RiLockPasswordFill } from "react-icons/ri";

const PasswordInput = ({ password, setPassword, prompt = "" }) => {
  return (
    <div className="relative flex items-center border-b-2 border-black">
      <RiLockPasswordFill className="absolute text-black text-xl left-3" />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="pl-10 pr-3 py-2 w-full bg-transparent text-black leading-tight focus:outline-none placeholder-black"
        placeholder={prompt || "Type Your Password"}
        required
      />
    </div>
  );
};

export default PasswordInput;
