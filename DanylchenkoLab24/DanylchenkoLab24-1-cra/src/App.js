import HobbyClass      from './HobbyClass';
import HobbyFunctional from './HobbyFunctional';
import './App.css';

const data = {
  name:        'Данильченко',
  description: 'Захоплююся веб-розробкою та програмуванням. ' +
               'Люблю створювати цікаві проєкти, вивчати нові технології ' +
               'та вирішувати нестандартні задачі.',
  hobbies: ['Веб-розробка', 'JavaScript', 'React', 'Програмування', 'UI/UX дизайн', 'Open Source'],
};

function App() {
  return (
    <main className="center">
      <div className="card">
        <HobbyClass      {...data} />
        <hr />
        <HobbyFunctional {...data} />
      </div>
    </main>
  );
}

export default App;
