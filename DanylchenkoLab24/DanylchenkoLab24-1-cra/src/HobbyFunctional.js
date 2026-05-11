function HobbyFunctional({ name, hobbies, description }) {
  return (
    <div className="section">
      <span className="badge">Functional Component</span>
      <h1>{name}</h1>
      <h2>Мої хобі</h2>
      <p>{description}</p>
      <div className="hobbies">
        {hobbies.map((h, i) => (
          <span key={i} className="hobby-tag">{h}</span>
        ))}
      </div>
    </div>
  );
}

export default HobbyFunctional;
