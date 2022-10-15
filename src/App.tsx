import "./App.css";
import CanvasGalaxy from "./CanvasGalaxy";

function App() {
  return (
    <div className="App">
      <div className="overlay">
        <div className="container">
          <div className="box">
            <h1>Santiago Pan Carneiro</h1>
            <p>This galaxy is randomly generated and rendered on canvas.</p>
            <a
              href="https://www.linkedin.com/in/santiagopancarneiro"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/santiago-pan"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <CanvasGalaxy></CanvasGalaxy>
    </div>
  );
}

export default App;
