// Library
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Components
import Dashboard from "./containers/Dashboard";
import AddTransaction from "./containers/AddTransaction";
import AddSource from "./containers/AddSource";

// Routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Style
import "./style/containers.scss";
import "./style/dashboard.scss";

// Middleware
import Authenticated from "./middleware/Authenticated";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Authenticated>
      <Routes>
        <Route path="/add-income" element={<AddTransaction />} />
        <Route path="/add-expense" element={<AddTransaction />} />
        <Route path="/sources" element={<AddSource />} />
        <Route path="/add-source" element={<AddSource />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </Authenticated>
  </BrowserRouter>
);
