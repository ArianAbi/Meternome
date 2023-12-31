import { useEffect, useState, useContext } from "react";
import { settingCtx } from "../App";

export type userPreference = {
  sound: "HiHat" | "kick" | "snare";
};

export default function Settings() {
  const setting = useContext(settingCtx);

  type soundsType = { sound: "HiHat" | "kick" | "snare"; img: string }[];

  const sounds: soundsType = [
    { sound: "HiHat", img: "/Sound-Icons/hihat.png" },
    { sound: "kick", img: "/Sound-Icons/kick.png" },
    { sound: "snare", img: "/Sound-Icons/snare.png" },
  ];

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
        <div className="w-full grid grid-cols-2 gap-4">
          {sounds.map((_el, i) => {
            return (
              <div
                className={`w-auto text-lg text-center aspect-square px-6 py-2 rounded-md bg-opacity-5 transition-all duration-150
                ${
                  sound === _el.sound
                    ? "bg-white outline outline-2 outline-white"
                    : "opacity-60"
                }`}
                onClick={() => handleSoundChange(_el.sound)}
                key={i}
              >
                <img
                  className="w-10 sm:w-14 md:w-16 transition-opacity "
                  src={_el.img}
                />

                <h3 className="mt-2">{_el.sound}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
