import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCar, FaHome } from "react-icons/fa";
import { RiListSettingsLine } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

const Footer = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/"); // Default active tab is home

  const handleNavigate = (path) => {
    // Check if the target path is 'garage' and the user is not logged in
    if (path === "/garage" && !user) {
      navigate("/auth"); // Redirect to login if not logged in
      setActiveTab("/garage");
    } else {
      navigate(path);
      setActiveTab(path);
    }
  };

  return (
    <div className="flex gap-20 justify-center p-4 h-[10.5dvh] items-center absolute bottom-0 w-full rounded-tl-3xl rounded-tr-3xl bg-white shadow-custom-top-lg">
      {[
        {
          icon: <FaHome className="text-3xl text-black" />,
          path: "/",
          label: "Home",
        },
        {
          icon: <FiUser className="text-3xl text-black" />,
          path: user ? "/profile" : "/auth",
          label: "Profile",
        },
        {
          icon: <FaCar className="text-3xl text-black" />,
          path: "/garage",
          label: "Garage",
        },
        {
          icon: <RiListSettingsLine className="text-3xl text-black" />,
          path: "/settings",
          label: "Settings",
        },
      ].map((item) => (
        <button
          key={item.path}
          onClick={() => handleNavigate(item.path)}
          className="flex flex-col items-center text-gray-600"
        >
          {item.icon}
          {activeTab === item.path && (
            <div className="h-[0.15rem] w-5 bg-blue-500  mt-1"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Footer;
