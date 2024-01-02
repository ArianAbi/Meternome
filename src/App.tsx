import { createContext, useState } from "react";
import Metronome from "./Metronome";

interface ctx {
  value: any;
  updateValue: (newValue: any) => void;
}

export const settingCtx = createContext<ctx | undefined>(undefined);

export default function App() {
  const userPreference = localStorage.getItem("userPreference");

  const [value, setValue] = useState(
    userPreference ? JSON.parse(userPreference) : null
  );

  function updateValue(newValue: any) {
    setValue(newValue);
  }

  return (
    <settingCtx.Provider value={{ value, updateValue }}>
      {/* <Provide /> */}
      <Metronome />
    </settingCtx.Provider>
  );
}
