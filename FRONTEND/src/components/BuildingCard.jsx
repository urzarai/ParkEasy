function BuildingCard({ building, onClick }) {
  return (
    <div className="card building-card" onClick={() => onClick(building)}>
      <h3>{building.name}</h3>
      <p>{building.abbreviation}</p>
    </div>
  );
}

export default BuildingCard;
