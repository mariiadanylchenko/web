import { Component } from 'react';

class HobbyClass extends Component {
  render() {
    const { name, hobbies, description } = this.props;
    return (
      <div className="section">
        <span className="badge">Class Component</span>
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
}

export default HobbyClass;
