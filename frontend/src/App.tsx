import { Provider } from "react-redux";
import { store } from "../src/config/redux/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
}
