import { FaUser } from "react-icons/fa";

const NameInput = ({ name, setName }) => {
  return (
    <div className="relative flex items-center border-b-2 border-black">
      <FaUser className="absolute text-black text-xl left-3" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="pl-10 pr-3 py-2 w-full bg-transparent text-black leading-tight focus:outline-none placeholder-black"
        placeholder="Type Your Name"
        required
      />
    </div>
  );
};

export default NameInput;
