import CarScrollCard from "./CarScrollCard";
import { useNavigate } from "react-router-dom";

const CarScroller = ({ cars = [], selectCar, selectedCar }) => {
  const navigate = useNavigate();
  return (
    <div className="flex overflow-x-auto scroll-smooth scrollbar-hide space-x-4 md:flex-col md:gap-4 items-center">
      {cars.length > 0 ? (
        cars.map((car, index) => {
          const miles = ((car.maxMiles / 100) * car.charge).toFixed(0);
          return (
            <div
              key={car._id}
              onClick={() => selectCar(car)}
              className={`${
                selectedCar && selectedCar._id === car._id
                  ? "border-2 border-blue-500 rounded-xl shadow-xl"
                  : ""
              }`}
            >
              <CarScrollCard carData={car} index={index} miles={miles} />
            </div>
          );
        })
      ) : (
        <div>
          <p>You have no cars</p>
        </div>
      )}
      <button
        className="bg-blue-500 text-white rounded-md p-2"
        onClick={() => {
          navigate("/garage");
        }}
      >
        Add Car
      </button>
    </div>
  );
};

export default CarScroller;
