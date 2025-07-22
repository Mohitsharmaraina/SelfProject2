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
  const [field, setField] = useState("");
  const [value, setValue] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const handleField = (e) => {
    const value = e.target.value;
    setField(value);
  };
  const handleValue = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const getField = () => {
    if (field === "gender") return genderValues;
    if (field === "city") return cityValues;
    if (field === "state") return stateValues;
    return [];
  };
  console.log(field, value);
  const handleSearch = async () => {
    setSearchedData([]);
    const response = await fetch(
      `http://localhost:4500/user?field=${encodeURIComponent(
        field
      )}&value=${encodeURIComponent(value)}`,
      {
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const results = await response.json();
    console.log(results);

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
          Phone = Phone.join(", ");
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
  };

  return (
    <div className="absolute min-h-40 w-full card flex-1 flex flex-col gap-4">
      <div>
        <label htmlFor="Field">Choose a Field:</label>
        <select
          className="border ml-2 mb-2"
          name="Field"
          id="Field"
          onChange={handleField}
        >
          <option value="">-- Choose Field --</option>
          <option value="gender">Gender</option>
          <option value="city">City</option>
          <option value="state">State</option>
        </select>
      </div>
      {field && (
        <div>
          <label htmlFor="Value">Choose a Value:</label>
          <select
            className="border ml-2"
            name="Value"
            id="Value"
            onChange={handleValue}
          >
            <option value="">-- Choose Value --</option>
            {getField().map((item, i) => (
              <option key={i} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        className="absolute max-w-20 left-[40%] top-[70%]"
        onClick={handleSearch}
      >
        Search
      </button>
      {searchedData.length !== 0 && (
        <div className=" absolute w-full mt-40 flex justify-center">
          <table className="table-auto border mt-4">
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
  );
};

export default Search;
