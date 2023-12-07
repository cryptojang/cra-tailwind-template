import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import Mint from "./pages/mint";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/mint" element={<Mint />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
