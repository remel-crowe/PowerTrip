import InteractiveMap from "../components/InteractiveMap";

const Home = ({ currentCar }) => {
  return (
    <div>
      <InteractiveMap selectedCar={currentCar} />
    </div>
  );
};

export default Home;
