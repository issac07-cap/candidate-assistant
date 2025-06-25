import React from 'react';
import WebcamStreamCapture from './WebcamStreamCapture';
import questions from './questions.json';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [capturing, setCapturing] = React.useState(false);
  const [recordingNumber, setRecordingNumber] = React.useState(1); // attempt counter per question
  const [attemptsLeft, setAttemptsLeft] = React.useState(3);       // attempts per question

  const handleStart = () => setCapturing(true);
  const handleStop = () => setCapturing(false);

  const handleRetake = () => {
    if (attemptsLeft > 1) {
      setAttemptsLeft((prev) => prev - 1);
      setRecordingNumber((prev) => prev + 1);
      setCapturing(false); // reset capturing
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setRecordingNumber(1); // reset attempts
      setAttemptsLeft(3);   // reset attempts
    }
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <div className="circles">
          {questions.map((q, index) => (
            <div key={q.id} className={`circle ${index <= currentIndex ? 'active' : ''}`} />
          ))}
        </div>

        <WebcamStreamCapture
          capturing={capturing}
          onStart={handleStart}
          onStop={handleStop}
          currentIndex={currentIndex}
          recordingNumber={recordingNumber}
        />

        {!capturing && attemptsLeft > 1 && (
          <button className="retake-btn" onClick={handleRetake}>Retake ({attemptsLeft - 1} left)</button>
        )}
      </div>

      <div className="right-panel">
        <div className="question-box">
          <h2>Question {questions[currentIndex].id}</h2>
          <p>{questions[currentIndex].text}</p>
          <button className="next-btn" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default App;
