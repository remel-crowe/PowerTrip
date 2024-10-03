import InteractiveMap from "../components/InteractiveMap";
import CarScroller from "../components/CarScroller";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = ({ user, cars }) => {
  const [selectedCar, setSelectedCar] = useState(null);

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const navigate = useNavigate();
  return (
    <div>
      <InteractiveMap selectedCar={selectedCar} />
    </div>

    // <div className="flex mt-5 flex-col md:flex-row md:mt-10">
    //   <InteractiveMap selectedCar={selectedCar} />

    //   {user ? (
    //     <CarScroller
    //       cars={cars}
    //       selectCar={handleCarSelect}
    //       selectedCar={selectedCar}
    //     />
    //   ) : (
    //     <div className="text-center w-full h-full flex flex-col justify-center items-center px-3 mt-4">
    //       <h1>Sign In To View Cars</h1>
    //       <button
    //         onClick={() => {
    //           navigate("/auth");
    //         }}
    //         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    //       >
    //         Sign In
    //       </button>
    //     </div>
    //   )}
    // </div>
  );
};

export default Home;
