import { useState } from "react";
import { MdCancel } from "react-icons/md";

const AddCarModal = ({ onAdd, onClose }) => {
  const [car, setCar] = useState({
    make: "",
    model: "",
    maxMiles: "",
    charge: "",
    fastCharge: "",
  });

  const handleChange = (e) => {
    setCar({
      ...car,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(car);
    onClose();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay to darken the background */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-[400px] bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Add Car</h1>
          <MdCancel
            onClick={onClose}
            className="cursor-pointer text-red-500 text-3xl"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="make"
              className="block text-sm font-medium text-gray-700"
            >
              Make
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={car.make}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700"
            >
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={car.model}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="maxMiles"
              className="block text-sm font-medium text-gray-700"
            >
              Max Miles
            </label>
            <input
              type="number"
              id="maxMiles"
              name="maxMiles"
              value={car.maxMiles}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="charge"
              className="block text-sm font-medium text-gray-700"
            >
              Charge
            </label>
            <input
              type="number"
              id="charge"
              name="charge"
              value={car.charge}
              max={100}
              min={1}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700">
              Fast Charge
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fastChargeTrue"
                  name="fastCharge"
                  value="true"
                  checked={car.fastCharge === "true"}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fastChargeFalse"
                  name="fastCharge"
                  value="false"
                  checked={car.fastCharge === "false"}
                  onChange={handleChange}
                  className="form-radio text-blue-600"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Car
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarModal;
