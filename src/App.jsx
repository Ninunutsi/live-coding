import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [scores, setScores] = useState(200);
  const [question, setQuestion] = useState(1);
  const [currentQuestion, setCurerntQuestion] = useState(0);
  const [data, setData] = useState([]);
  const [time, setTime] = useState(0);
  const [selected, setSelected] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [tryAgainBtn, setTryAgainBtn] = useState(false);

  useEffect(() => {
    fetch("https://random-colors-lovat.vercel.app/")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err.message));
  }, [tryAgainBtn]);

  const handleAnswer = (e) => {
    const correctAnswer = e.target.innerText.slice(1);
    setSelected(correctAnswer);
  };
  let interval;
  useEffect(() => {
    if (isClicked) {
      interval = setInterval(() => {
        setTime(time + 1);
      }, 1000);
    }
    if (lastPage) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isClicked, time]);

  const handleClick = () => {
    if (currentQuestion !== 9) {
      setIsClicked(true);
      setQuestion(question + 1);
      if (selected !== data[currentQuestion].color) {
        setScores(scores - 20);
        console.log(selected);
        console.log("araa swori");
        setCurerntQuestion(currentQuestion + 1);
      } else {
        setCurerntQuestion(currentQuestion + 1);
      }
    } else {
      clearInterval(interval);
      setLastPage(true);
    }
  };

  const tryAgain = () => {
    setCurerntQuestion(0);
    setTryAgainBtn(true);
    setQuestion(1);
    setLastPage(false);
    setScores(200);
  };

  return (
    <main className="App">
      <div className="score white-container">{scores}</div>
      <div className="question white-container">{question}/10</div>
      <h2>Color Quiz</h2>
      {lastPage ? (
        <section className="lastPage">
          <h1>your score is : {scores} </h1>
          <h1>Time : {time} second </h1>
          <button className="try-again" onClick={tryAgain}>
            Try again
          </button>
        </section>
      ) : (
        <section className="quiz-container">
          <h3>color:</h3>
          {data && data[currentQuestion] ? (
            <p
              className="color"
              style={{ backgroundColor: data[currentQuestion].color }}
            ></p>
          ) : (
            <p>loading data...</p>
          )}
          <ul>
            {data && data[currentQuestion] ? (
              data[currentQuestion].answers.map((color, key) => (
                <li onClick={handleAnswer} key={key} value={color}>
                  <span>{key}</span>
                  {color}
                </li>
              ))
            ) : (
              <p>loading data...</p>
            )}
          </ul>
          <button onClick={handleClick}>Continue</button>
        </section>
      )}
    </main>
  );
}

export default App;
