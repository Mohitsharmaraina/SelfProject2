// import { useEffect, useState } from "react";
// const Search = () => {
//   const [query, setQuery] = useState([{ field: "", value: "" }]);
//   const [data, setData] = useState("");
//   const [searchedData, setSearchedData] = useState([]);

//   const handleQuery = (e) => {
//     const value = e.target.value;
//     setData(value);
//   };
//   useEffect(() => {
//     const userQuery = () => {
//       const final = data.split("=");
//       if (final.length === 2) {
//         setQuery({ field: final[0].trim(), value: final[1].trim() });
//       }
//     };
//     userQuery();
//   }, [data]);

//   const handleSearch = async () => {
//     const response = await fetch(
//       `http://localhost:4500/user?field=${encodeURIComponent(
//         query.field
//       )}&value=${encodeURIComponent(query.value)}`,
//       {
//         method: "get",
//         headers: {
//           "content-type": "application/json",
//         },
//       }
//     );
//     const result = await response.json();
//     const data = result.res[0].names;
//     setSearchedData(data);
//   };

//   return (
//     <div className="card ">
//       <input
//         className="border  w-full p-2 text-xl font-medium rounded-lg"
//         type="text"
//         value={data}
//         onChange={handleQuery}
//         placeholder="Enter query like:- gender=male, city=Delhi, country=India"
//       />
//       <button onClick={handleSearch}>Search</button>

//       {searchedData.length !== 0 && (
//         <div className="absolute w-full mt-20 flex justify-center">
//           <table className="table-auto border mt-4">
//             <thead>
//               <tr>
//                 <th className="border px-4 py-2">S.No.</th>
//                 <th className="border px-4 py-2">Names</th>
//               </tr>
//             </thead>
//             <tbody>
//               {searchedData.map((item, index) => (
//                 <tr key={index}>
//                   <td className="border px-4 py-2">{index + 1}</td>
//                   <td className="border px-4 py-2">{item}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;

import { useEffect, useState } from "react";

const Search = () => {
  // for fetching final results
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    gender: "",
  });

  // for storing user selected state
  const [state, setState] = useState();

  // for diabling search button

  const [disable, setDisable] = useState(true);

  // for storing array of data coming from database
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);

  // handling search button disable

  useEffect(() => {
    if (!filters.state && !filters.city && !filters.gender) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [filters]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setState(value);
    }
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // fetching states from database
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("http://localhost:4500/search/states");
        const result = await response.json();
        const states = result.result[0].states;

        setStateData(states);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStates();
  }, []);

  // fetching cities based on user state
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `http://localhost:4500/search/cities?state=${state}`
        );
        const result = await response.json();
        const cities = result.result[0].cities;

        setCityData(cities);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCities();
  }, [state]);
  console.log(state);
  const handleSearch = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setSearchedData([]);
      const query = Object.entries(filters)
        .filter(([_, val]) => val !== "")
        .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
        .join("&");
      //console.log("query", query);
      const response = await fetch(
        `http://localhost:4500/search/user?${query}`,
        {
          method: "get",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const results = await response.json();
      //console.log(results);
      // Ensure the structure is valid
      if (
        results.res &&
        results.res.length > 0 &&
        Array.isArray(results.res[0].names)
      ) {
        const entries = results.res[0].names;

        const newData = entries.map((entry) => {
          const Name = entry.name || { first: "", last: "" };
          let Phone = entry.phone;

          if (!Phone || (Array.isArray(Phone) && Phone.length === 0)) {
            Phone = "xxxxxxxxxx";
          } else if (Array.isArray(Phone)) {
            Phone = Phone.join(", "); // turns array into readable string
          }

          return {
            firstName: Name.first,
            lastName: Name.last,
            phone: Phone,
          };
        });

        setSearchedData(newData);
        console.log("Data added:", newData);
      } else {
        console.log("No data found.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //console.log(searchedData);

  console.log(filters.state, filters.city, filters.gender);

  return (
    <div className="  w-full card flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-4 p-4 w-full max-w-md">
        <label>Gender:</label>
        <select
          name="gender"
          className="border ml-2 mb-2"
          onChange={handleFilterChange}
        >
          <option value="">-- Choose Gender --</option>

          <option key="male" value="male">
            male
          </option>
          <option key="female" value="female">
            female
          </option>
        </select>
        <label>State:</label>
        <select
          name="state"
          className="border ml-2 mb-2"
          onChange={handleFilterChange}
        >
          <option value="">-- Choose State --</option>
          {stateData.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
        {cityData.length > 0 && (
          <>
            <label>City:</label>

            <select
              name="city"
              className="border ml-2 mb-2"
              onChange={handleFilterChange}
            >
              <option value="">-- Choose City --</option>
              {cityData.length > 0 &&
                cityData.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </>
        )}

        <button
          disabled={disable}
          onClick={handleSearch}
          type="button"
          className={`${disable && "bg-blue-200"}`}
        >
          Search
        </button>
        {searchedData.length !== 0 && (
          <div className=" w-full  flex justify-center">
            <table className=" relative table-auto border mt-2 ">
              <thead>
                <tr>
                  <th className="border px-4 py-2">S.No.</th>
                  <th className="border px-4 py-2">First Name</th>
                  <th className="border px-4 py-2">Last Name</th>
                  <th className="border px-4 py-2">Contact</th>
                </tr>
              </thead>
              <tbody>
                {searchedData.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.firstName}</td>
                    <td className="border px-4 py-2">{item.lastName}</td>
                    <td className="border px-4 py-2">{item.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
