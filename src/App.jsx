import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { calculateWPM, calculateAccuracy } from './utils';

const scripts = [
  `The quick brown fox jumps over the lazy dog. It is a pangram that contains every letter of the alphabet at least once. This sentence is often used for typing practice.`,
  `React makes it painless to create interactive UIs. Build encapsulated components that manage their own state. Compose them to make complex UIs.`,
  `JavaScript is a versatile and popular programming language. It powers the frontend and increasingly the backend as well. Learning JavaScript opens many opportunities.`,
  `Practice makes perfect, so keep coding and improving! Challenge yourself with daily tasks. Solve problems and write clean code.`,
  `Frontend development involves HTML, CSS, and JavaScript. These technologies shape how websites and applications look and behave. Mastering them is essential.`,
  `Typing fast and accurately is a valuable skill for programmers. It boosts productivity and minimizes errors. Use regular practice to enhance your skills.`,
  `Write clean and readable code for better collaboration. Use meaningful variable names and comments. Follow coding standards and best practices.`,
  `Debugging is an essential skill in software development. Understand error messages and use debugging tools. It helps find and fix bugs faster.`,
  `Learning new technologies expands your abilities and opportunities. Stay current with trends and frameworks. Continuous learning is key in tech.`,
  `Challenge yourself daily to become a better developer. Set goals and build projects. Reflect on your progress and iterate to improve.`,
];

const levelConfig = {
  beginner: 30,
  medium: 60,
  expert: 90,
};

function snippetPreview(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export default function App() {
  const [level, setLevel] = useState('medium');
  const [timeLeft, setTimeLeft] = useState(levelConfig[level]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [input, setInput] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!timerRunning) {
      setTimeLeft(levelConfig[level]);
      setInput('');
      setWpm(0);
      setAccuracy(100);
      setCurrentText('');
    }
  }, [level, timerRunning]);

  useEffect(() => {
    if (timerRunning) {
      if (timeLeft <= 0) {
        finishTest();
        return;
      }
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [timerRunning, timeLeft]);

  const handleInputChange = (e) => {
    if (!timerRunning) return;
    const val = e.target.value;
    if (val.length > currentText.length) return;
    setInput(val);
    const elapsedSeconds = levelConfig[level] - timeLeft;
    setWpm(Math.round(calculateWPM(val, currentText, elapsedSeconds)));
    setAccuracy(Math.round(calculateAccuracy(val, currentText)));
  };

  const startTest = () => {
    if (timerRunning) return;
    setCurrentText(scripts[selectedScriptIndex]);
    setInput('');
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(levelConfig[level]);
    setTimerRunning(true);
  };

  const finishTest = () => {
    setTimerRunning(false);
    clearInterval(intervalRef.current);
  };

  const buildTextDisplay = () => {
    return currentText.split('').map((char, idx) => {
      let className = '';
      if (input.length > idx) {
        className = input[idx] === char ? 'correct' : 'incorrect';
      }
      return (
        <span key={idx} className={className}>
          {char}
        </span>
      );
    });
  };

  const levelClass = {
    beginner: 'level-beginner',
    medium: 'level-medium',
    expert: 'level-expert',
  }[level];

  return (
    <div className={`container ${levelClass}`}>
      <h1>Typing Test</h1>

      <div className="settings" style={{ gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '280px' }}>
          <label htmlFor="script-select">Choose Script:</label><br />
          <select
            id="script-select"
            value={selectedScriptIndex}
            onChange={(e) => setSelectedScriptIndex(Number(e.target.value))}
            disabled={timerRunning}
            aria-label="Typing Test Script Selection"
            style={{ width: '100%' }}
          >
            {scripts.map((script, idx) => (
              <option key={idx} value={idx} title={script}>
                {snippetPreview(script, 80)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '180px' }}>
          <label htmlFor="level-select">Choose Level:</label><br />
          <select
            id="level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            disabled={timerRunning}
            aria-label="Typing Test Level Selection"
            style={{ width: '100%' }}
          >
            <option value="beginner">Beginner (30 sec)</option>
            <option value="medium">Medium (60 sec)</option>
            <option value="expert">Expert (90 sec)</option>
          </select>
        </div>
      </div>

      <div id="test-text" aria-live="polite" aria-atomic="true" style={{ minHeight: '140px' }}>
        {currentText ? buildTextDisplay() : 'Select a script and click "Start Test" to begin!'}
      </div>

      <textarea
        id="input-area"
        placeholder="Start typing here..."
        disabled={!timerRunning}
        value={input}
        onChange={handleInputChange}
        spellCheck={false}
        aria-label="Typing input area"
      ></textarea>

      <div className="stats" aria-live="polite" aria-atomic="true">
        <div>Time Left: <span id="timer">{timeLeft}</span>s</div>
        <div>WPM: <span id="wpm">{wpm}</span></div>
        <div>Accuracy: <span id="accuracy">{accuracy}</span>%</div>
      </div>

      <button
        id="start-btn"
        onClick={startTest}
        disabled={timerRunning}
        aria-live="polite"
      >
        Start Test
      </button>
    </div>
  );
}
