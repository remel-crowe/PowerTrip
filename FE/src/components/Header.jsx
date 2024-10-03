import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { RiMenuFold3Fill } from "react-icons/ri";

const Header = ({ user, logout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap bg-white text-sm py-4 dark:bg-neutral-800">
      <nav
        className="w-full mx-auto px-5 flex flex-wrap basis-full items-center justify-between"
        aria-label="Global"
      >
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src="/power.png"
            alt="PowerTrip"
            className="w-[150px] md:w-[180px]"
          />
        </div>

        {user ? (
          <>
            <button
              type="button"
              className="sm:hidden p-2.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10"
              onClick={toggleMenu}
              aria-controls="navbar-alignment"
              aria-label="Toggle navigation"
            >
              <RiMenuFold3Fill />
            </button>

            <div
              className={`sm:order-3 flex items-center gap-x-2 md:flex ${
                isMenuOpen ? "block" : "hidden md:block"
              } ${
                isMenuOpen
                  ? "animate-slide-in-right"
                  : "animate-slide-out-right md:animate-none"
              }`}
              style={{ animationDuration: "0.5s" }}
            >
              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
                onClick={() => navigate("/profile")}
              >
                Profile
              </a>

              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
                aria-label="Garage"
                onClick={() => navigate("/garage")}
              >
                Garage
              </a>

              <a
                className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </a>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
// {
//   user && (
//
//   );
// }
