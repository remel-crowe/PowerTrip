const TripDetails = ({ tripDuration, tripDistance }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  };

  const formatDistance = (meters) => {
    const Miles = (meters / 1609.34).toFixed(0);
    return `${Miles} Miles`;
  };

  return (
    <div className="absolute bottom-[20px] right-[20px] bg-white p-4 rounded-lg shadow-md z-50">
      <div>
        <strong>Duration:</strong> {formatDuration(tripDuration)}
      </div>
      <div>
        <strong>Distance:</strong> {formatDistance(tripDistance)}
      </div>
    </div>
  );
};

export default TripDetails;
