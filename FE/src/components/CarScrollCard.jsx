import { useState } from "react";
import {
  FaBatteryFull,
  FaBatteryThreeQuarters,
  FaBatteryHalf,
  FaBatteryQuarter,
  FaBatteryEmpty,
  FaEdit,
} from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { updateCharge } from "../services/user.service";

const CarScrollCard = ({ carData, index, miles }) => {
  const { make, model, maxMiles, charge: initialCharge, fastCharge } = carData;
  const [editMode, setEditMode] = useState(false);
  const [charge, setCharge] = useState(initialCharge);

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
    <div className="flex border rounded-lg p-4 shadow-md md:w-[350px]">
      <div className="w-full flex justify-center gap-5">
        <h2 className="text-xl font-semibold w-[100px]">
          {make} {model}
        </h2>
        <p className="text-gray-600">
          <GiPathDistance /> {miles}
        </p>
        <p>
          {editMode ? (
            <input
              type="number"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              onBlur={() => handleChargeUpdate(charge)}
              className="text-gray-600"
              autoFocus
            />
          ) : (
            <div className="flex gap-2 items-center">
              <div>
                {chargeIcon(charge)} {charge}%{" "}
              </div>

              <FaEdit
                onClick={() => setEditMode(true)}
                className="cursor-pointer"
              />
            </div>
          )}
        </p>
        <p className="text-gray-600">{fastCharge}</p>
      </div>
    </div>
  );
};

export default CarScrollCard;
