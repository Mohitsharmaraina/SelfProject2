import logo from "../Images/logo.png";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="flex-1 flex flex-wrap w-full h-20 bg-blue-900 items-center pl-8 ">
      <div>
        <a href="/digits">
          <img src={logo} alt="logo" className="size-12 rounded-full" />
        </a>
      </div>
      <div className="flex-1 flex justify-end mr-8 ">
        <ul className="flex-1 flex  justify-end gap-4 text-xl font-medium ">
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-white" : "text-gray-400"
            }
            to={"/digits"}
          >
            Digits
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-white" : "text-gray-400"
            }
            to={"/toggle"}
          >
            Toggle
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-white" : "text-gray-400"
            }
            to={"/search"}
          >
            Search
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "text-white" : "text-gray-400"
            }
            to={"/upload"}
          >
            Upload
          </NavLink>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
