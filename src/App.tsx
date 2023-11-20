import { createContext, useState } from "react";
import Metronome from "./Metronome";
import { userPreference } from "./components/Settings";

interface ctx {
  value: userPreference | null;
  updateValue: (newValue: userPreference) => void;
}

export const settingCtx = createContext<ctx | undefined>(undefined);

export default function App() {
  const userPreference = localStorage.getItem("userPreference");

  const [value, setValue] = useState(
    userPreference ? (JSON.parse(userPreference) as userPreference) : null
  );

  function updateValue(newValue: userPreference) {
    setValue(newValue);
  }

  return (
    <settingCtx.Provider value={{ value, updateValue }}>
      {/* <Provide /> */}
      <Metronome />
    </settingCtx.Provider>
  );
}
