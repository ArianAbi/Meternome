import { createContext, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Metronome from "./Metronome";
import Header from "./components/Header";

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
    <div className="mx-auto flex h-[100svh] max-w-screen-md flex-col items-center">
      <settingCtx.Provider value={{ value, updateValue }}>
        <LazyMotion features={domAnimation}>
          <Header />
          <Metronome />
        </LazyMotion>
      </settingCtx.Provider>
    </div>
  );
}
