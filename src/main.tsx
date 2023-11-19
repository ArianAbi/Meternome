import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import Metronome from "./Metronome";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Metronome />
  </React.StrictMode>
);
