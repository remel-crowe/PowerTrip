import { MdEmail } from "react-icons/md";

const EmailInput = ({ email, setEmail }) => {
  return (
    <div className="relative flex items-center border-b-2 border-black">
      <MdEmail className="absolute text-black text-xl left-3" />
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="pl-10 pr-3 py-2 w-full bg-transparent text-black leading-tight focus:outline-none placeholder-black"
        placeholder="Type your email"
        required
      />
    </div>
  );
};

export default EmailInput;
