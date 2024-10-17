import { useState } from "react";

import {
  FaBatteryFull,
  FaBatteryThreeQuarters,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryEmpty,
} from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { GiPathDistance } from "react-icons/gi";

import { updateCharge } from "../services/user.service";

const CarCard = ({ carData, index, onRemove, onSelect, isSelected }) => {
  const { make, model, maxMiles, charge: initialCharge, fastCharge } = carData;
  const [editMode, setEditMode] = useState(false);
  const [charge, setCharge] = useState(initialCharge);

  const handleDelete = () => {
    onRemove(index);
  };

  const handleChargeUpdate = (newCharge) => {
    updateCharge(index, newCharge) // Assuming updateCharge returns a promise
      .then(() => {
        setCharge(newCharge);
        setEditMode(false);
      })
      .catch((error) => console.error("Failed to update charge:", error));
  };

  const chargeIcon = (charge) => {
    if (charge > 75) {
      return <FaBatteryFull className="text-green-400" />;
    } else if (charge > 50) {
      return <FaBatteryThreeQuarters className="text-green-400" />;
    } else if (charge > 25) {
      return <FaBatteryHalf className="text-orange-300" />;
    } else if (charge > 10) {
      return <FaBatteryQuarter className="text-red-300" />;
    } else {
      return <FaBatteryEmpty className="text-red-300" />;
    }
  };

  return (
    <div
      className={`w-full shadow-md flex rounded-lg md:flex-col mb-4 ${
        isSelected ? "border-4 border-green-500 animate-glow" : ""
      }`}
      onClick={() => {
        onSelect();
      }}
    >
      <figure className="w-[200px] ">
        <img
          src={`/car-models/${make}_${model}.jpeg`}
          alt="Car Image"
          className=" w-full h-full md:w-[full] md:h-40 object-cover"
        />
      </figure>
      <div className="p-3 items-center flex flex-col">
        <div>
          <h2 className="">
            {make} {model}
          </h2>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <GiPathDistance />
            <p>{((charge / 100) * maxMiles).toFixed(0)}</p>
          </div>

          <div className="flex flex-col items-center">
            {chargeIcon(charge)}
            <p>{charge}%</p>
          </div>
          <div className="flex flex-col items-center">
            <BsFillLightningChargeFill className="text-yellow-500" />
            <p>{fastCharge ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="flex flex-col mt-2">
          {editMode ? (
            <input
              type="number"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          ) : null}
          {editMode ? (
            <button
              onClick={() => handleChargeUpdate(charge)}
              className="bg-blue-500 rounded px-2 text-white mt-2 shadow-md"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 rounded px-2 text-white mt-2 shadow-md"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="bg-red-500 rounded px-2 text-white mt-2 shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
