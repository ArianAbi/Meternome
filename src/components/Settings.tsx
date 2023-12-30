import { useEffect, useState, useContext } from "react";
import { settingCtx } from "../App";

export type userPreference = {
  sound: "HiHat" | "kick" | "snare";
};

export default function Settings() {
  const setting = useContext(settingCtx);

  const [sound, setSound] = useState(setting ? setting.value?.sound : "HiHat");

  function handleSoundChange(sound: "HiHat" | "kick" | "snare") {
    setSound(sound);
  }

  const userPreference = {
    sound,
  };

  useEffect(() => {
    if (setting) {
      setting.updateValue(userPreference as userPreference);
    }

    const stringifyPreference = JSON.stringify(userPreference);
    localStorage.setItem("userPreference", stringifyPreference);
  }, [sound]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 px-2">
        <div className="w-full">
          <ol>
            <h2 className="mb-2 text-base font-semibold">Tick Sound</h2>
            <li
              className="ml-4 flex gap-1"
              onClick={() => handleSoundChange("HiHat")}
            >
              <input
                type="radio"
                name="tickSound"
                value="sound1"
                checked={sound === "HiHat"}
                readOnly
              />
              <label>Hi Hat</label>
            </li>
            <li
              className="ml-4 flex gap-1"
              onClick={() => handleSoundChange("kick")}
            >
              <input
                type="radio"
                name="tickSound"
                value="sound2"
                checked={sound === "kick"}
                readOnly
              />
              <label>Kick</label>
            </li>
            <li
              className="ml-4 flex gap-1"
              onClick={() => handleSoundChange("snare")}
            >
              <input
                type="radio"
                name="tickSound"
                value="sound3"
                checked={sound === "snare"}
                readOnly
              />
              <label>Snare</label>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
