import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(...registerables);

function Counter() {
  const [number, setNumber] = useState(20);
  const [history, setHistory] = useState([20]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [notificationsShown, setNotificationsShown] = useState({
    subtract: false,
    add: false,
    undo: false,
    redo: false
  });

  const handleSubtract = () => {
    if (number > 0) {
      const newNumber = number - 1;
      updateHistory(newNumber);
    } else if (!notificationsShown.subtract) {
      toast.error("Cannot subtract, number is already at minimum (0).");
      setNotificationsShown(prev => ({ ...prev, subtract: true }));
    }
  };

  const handleAdd = () => {
    if (number < 150) {
      const newNumber = number + 1;
      updateHistory(newNumber);
    } else if (!notificationsShown.add) {
      toast.error("Cannot add, number is already at maximum (150).");
      setNotificationsShown(prev => ({ ...prev, add: true }));
    }
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setNumber(history[prevStep]);
      setCurrentStep(prevStep);
    } else if (!notificationsShown.undo) {
      toast.error("Nothing to undo.");
      setNotificationsShown(prev => ({ ...prev, undo: true }));
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      const nextStep = currentStep + 1;
      setNumber(history[nextStep]);
      setCurrentStep(nextStep);
    } else if (!notificationsShown.redo) {
      toast.error("Nothing to redo.");
      setNotificationsShown(prev => ({ ...prev, redo: true }));
    }
  };

  const updateHistory = (newNumber) => {
    const newHistory = history.slice(0, currentStep + 1); // Remove future steps if any
    newHistory.push(newNumber);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    setNumber(newNumber);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmitInput = () => {
    const newValue = parseInt(inputValue, 10);
    if (isNaN(newValue)) {
      toast.error("Please enter a valid number.");
    } else if (newValue < 0 || newValue > 150) {
      toast.error("Number must be between 0 and 150.");
    } else {
      updateHistory(newValue);
    }
    setInputValue(''); // Clear input field after submission
  };

  const progressBarHeight = (number / 150) * 100; // Height in percentage

  // Chart.js Data
  const chartData = {
    labels: ['Progress'],
    datasets: [
      {
        label: 'Counter Progress',
        data: [number],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 150,
      },
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center gap-10">
      {/* Vertical Progress Bar */}

      {/* Chart.js Bar Chart */}
      <div className="w-full max-w-md">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center justify-center bg-slate-200 p-5 rounded">
        <h1 className="text-4xl mb-4">Counter: {number}</h1>

        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 text-white rounded ${number > 0 ? 'bg-red-500 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handleSubtract}
          >
            Subtract 1
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${number < 150 ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handleAdd}
          >
            Add 1
          </button>
        </div>

        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 text-white rounded ${currentStep > 0 ? 'bg-gray-500 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handleUndo}
            disabled={currentStep === 0 && notificationsShown.undo}
          >
            Undo
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${currentStep < history.length - 1 ? 'bg-gray-500 hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handleRedo}
            disabled={currentStep === history.length - 1 && notificationsShown.redo}
          >
            Redo
          </button>
        </div>

        {/* Input Form */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            className="px-4 py-2 border rounded"
            min="0"
            max="150"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleSubmitInput}
          >
            Update Number
          </button>
        </div>

        {/* Toaster for notifications */}
        <Toaster />
      </div>
      <div className="relative w-16 h-96 bg-gray-200 rounded mb-4">
        {/* Progress Bar */}
        <div
          className="absolute bottom-0 left-0 w-full bg-blue-500 rounded transition-all duration-500 ease-out"
          style={{ height: `${progressBarHeight}%` }}
        />

      </div>
    </div>
  );
}

export default Counter;
