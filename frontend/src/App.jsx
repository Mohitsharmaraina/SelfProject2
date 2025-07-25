import {
  Button,
  RandomDigits,
  Search,
  Upload,
  Navbar,
} from "./components/Index.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/digits" element={<RandomDigits />}></Route>
          <Route path="/toggle" element={<Button />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/upload" element={<Upload />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
