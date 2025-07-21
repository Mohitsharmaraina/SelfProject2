import { useState, useRef } from "react";
const RandomDigits = () => {
  const [count, setCount] = useState(10);
  const [randDigits, setRandDigits] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [showData, setShowData] = useState(false);
  const digitsRef = useRef([]);
  let currentCount = 10;

  const deletedb = async () => {
    const response = await fetch("http://localhost:4500/rand", {
      method: "delete",
    });
    const result = await response.json();
    console.log(result);
  };

  const setRandomDigits = async () => {
    const response = await fetch("http://localhost:4500/rand", {
      method: "post",
      body: JSON.stringify(digitsRef.current),
      headers: {
        "content-type": "application/json",
      },
    });
    digitsRef.current = [];
    setRandDigits([]);
    const result = await response.json();
    console.log(result);
  };
  const startCounter = () => {
    const intervalId = setInterval(() => {
      currentCount--;

      setCount(currentCount);
      const digit = Math.floor(Math.random() * 100);
      const newDigit = { sec: currentCount, randNo: digit };

      digitsRef.current.push(newDigit); // ensures correct final array is send even in state delays
      setRandDigits((prevDigits) => [...prevDigits, newDigit]);
      if (currentCount === 0) {
        setTimeout(() => {
          setRandomDigits();
        });
        deletedb();

        clearInterval(intervalId);

        setCount(10);
      }
    }, 1000);
  };
  const getDigits = async () => {
    const response = await fetch("http://localhost:4500/rand");
    const result = await response.json();

    setApiData(result.data);
    setShowData(true);
  };

  return (
    <div className="card relative min-h-10 flex-1 flex ">
      <div className="absolute text-center bg-gray-200 px-4 rounded-sm top-2 left-[50%]">
        <h2>{count}</h2>
      </div>
      <div className="flex mt-12 items-center justify-center gap-4 ml-[40%]">
        <button onClick={startCounter}>Start</button>
        <button onClick={getDigits}>Get Digits</button>
      </div>
      {showData && (
        <div className="card absolute -ml-2 mt-28  ">
          <table className="table-auto border mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Seconds</th>
                <th className="border px-4 py-2">Random No</th>
              </tr>
            </thead>
            <tbody>
              {apiData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.sec}</td>
                  <td className="border px-4 py-2">{item.randNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RandomDigits;
