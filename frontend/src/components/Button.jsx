import { useState } from "react";
const Button = () => {
  const [status, setStatus] = useState(true);
  const [apiData, setApiData] = useState(false);
  const [msg, setMsg] = useState("Unclicked");
  const [display, setDisplay] = useState(false);

  const getApiData = async () => {
    const response = await fetch("http://localhost:4500/btnStatus");
    const result = await response.json();
    const res = result.status[0].status;
    setApiData(res);
    apiData === true ? setMsg("Unclicked") : setMsg("Clicked");
  };
  console.log("message", msg);
  console.log("api data", apiData);
  const changeStatus = async () => {
    setStatus(!status);
    const response = await fetch("http://localhost:4500/btnStatus", {
      method: "put",
      body: JSON.stringify({
        status,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const result = await response.json();
    console.log("put status:", result);
    getApiData();
  };

  return (
    <div className="card relative min-h-30 flex-1 flex ">
      <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-4">
        <button
          className={`clrBtn ${apiData ? `bg-red-400` : `bg-green-400`}`}
          onClick={changeStatus}
        >
          Color
        </button>
        <button onClick={() => setDisplay(!display)}>Status</button>
      </div>

      {display && (
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 w-full text-center">
          <h2 className="text-xl font-semibold">
            Status: <span className="text-blue-500">{msg}</span>
          </h2>
        </div>
      )}
    </div>
  );
};

export default Button;
