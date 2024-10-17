import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Garage from "./pages/Garage";
import Footer from "./components/Footer";

import {
  getCars,
  deleteCar,
  addCar,
  updateCharge,
} from "./services/user.service";

function App() {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("user");
    if (userName) {
      setUser(userName);
    }

    const fetchCars = async () => {
      const data = await getCars();
      setCars(data);
    };
    fetchCars();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/auth");
  };

  const removeVehicle = async (index) => {
    await deleteCar(index);
    const data = await getCars();
    setCars(data);
  };

  const addVehicle = async (car) => {
    await addCar(car);
    const data = await getCars();
    setCars(data);
  };

  const updateVehicle = async (index, charge) => {
    await updateCharge(index, charge);
    const data = await getCars();
    setCars(data);
  };

  const selectVehicle = (car) => {
    setSelectedCar(car);
  };

  return (
    <div className="w-full overflow-hidden font-outfit relative">
      {/* <Header user={user} logout={handleLogOut} /> */}
      <Routes>
        <Route
          path="/"
          element={<Home user={user} cars={cars} currentCar={selectedCar} />}
        />
        <Route path="/auth" element={<Auth setUser={setUser} />} />
        <Route
          path="/profile"
          element={<Profile user={user} logout={handleLogOut} />}
        />
        <Route
          path="/garage"
          element={
            <Garage
              cars={cars}
              onAdd={addVehicle}
              onRemove={removeVehicle}
              onEdit={updateVehicle}
              onSelect={selectVehicle}
              selectedCar={selectedCar}
            />
          }
        />
      </Routes>
      <Footer user={user} logout={handleLogOut} />
    </div>
  );
}

export default App;
