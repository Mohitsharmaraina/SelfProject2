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

import { useState } from "react";
import { genderValues } from "../constants/Values";
import { cityValues } from "../constants/Values";
import { stateValues } from "../constants/Values";

const Search = () => {
  const [filters, setFilters] = useState({
    gender: "",
    city: "",
    state: "",
  });

  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    //console.log(name, value);
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log(filters);
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
      const response = await fetch(`http://localhost:4500/user?${query}`, {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      });
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
  // console.log(searchedData);
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
          {genderValues.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>

        <label>City:</label>
        <select
          name="city"
          className="border ml-2 mb-2"
          onChange={handleFilterChange}
        >
          <option value="">-- Choose City --</option>
          {cityValues.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>State:</label>
        <select
          name="state"
          className="border ml-2 mb-2"
          onChange={handleFilterChange}
        >
          <option value="">-- Choose State --</option>
          {stateValues.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} type="button">
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
