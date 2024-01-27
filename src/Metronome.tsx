import { useState, useEffect, useRef, useContext } from "react";
import Controls from "./components/Controls";
import { Pendulum, PendulumContainer } from "./components/Pendulum";
import DialogBox from "./components/DialogBox";
import BarsSection from "./components/BarsSection";
import { useUpdatePrefrence } from "./components/Settings";
import { settingCtx } from "./App";

export default function Metronome() {
  const userPreference = useContext(settingCtx);

  const minTempo = 20;
  const maxTempo = 320;

  const metronome = useRef<NodeJS.Timeout | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pendulumWeightPosition, setPendulumWeightPosition] = useState(0);

  const [tickCount, setTickCount] = useState(0);

  const [tempo, setTempo] = useState(getTempo());
  const [bars, setBars] = useState(0);

  const [timeSignature, setTimeSignature] = useState(getTimeSignature());
  const [timeSigDialogOpen, setTimeSigDialogOpen] = useState(false);

  const msInMinute = 60000;
  const tickDuration = msInMinute / tempo;

  //get the tempo from the user preference storage
  function getTempo() {
    const defaultTempo = 120;

    if (userPreference && userPreference.value) {
      const tempo = userPreference.value.tempo;
      if (tempo) {
        return tempo;
      } else {
        return defaultTempo;
      }
    } else {
      return defaultTempo;
    }
  }

  //get the time signuture from the user preference storage
  function getTimeSignature() {
    const defaultTimeSignature = 4;

    if (userPreference && userPreference.value) {
      const timeSignature = userPreference.value.timeSignature;
      if (timeSignature) {
        return timeSignature;
      } else {
        return defaultTimeSignature;
      }
    } else {
      return defaultTimeSignature;
    }
  }

  //on tempo or time signuture change update the interval and update the prefrence
  useEffect(() => {
    //update preference
    useUpdatePrefrence({
      ...userPreference?.value,
      tempo,
      timeSignature,
    });

    // calculate pendulum position
    const ratio = 0.7;
    setPendulumWeightPosition(((tempo * 100) / maxTempo) * ratio);

    // reset the metronome
    if (metronome.current) {
      clearInterval(metronome.current);
      metronome.current = null;

      setTimeout(() => {
        metronome.current = setInterval(tickMetronome, tickDuration);
      }, 10);
    }
  }, [tempo, timeSignature]);

  //start or stop the metronome
  function toggleMetronome() {
    //start if we dont have a metronome
    if (!metronome.current) {
      setPlaying(true);
      setBars(0);
      metronome.current = setInterval(tickMetronome, tickDuration);
      return;
    }

    //else stop the metronome
    setPlaying(false);
    setTickCount(0);
    clearInterval(metronome.current);
    metronome.current = null;
  }

  //event listener for space bar to toggle metronome
  useEffect(() => {
    function toggleWithSpace(event: globalThis.KeyboardEvent) {
      if (event.code === "Space") {
        toggleMetronome();
      }
    }

    window.addEventListener("keydown", toggleWithSpace);

    return () => {
      window.removeEventListener("keydown", toggleWithSpace);
    };
  }, [metronome.current]);

  function tickMetronome() {
    setTickCount((prevCount) => {
      if (prevCount >= timeSignature) {
        setBars((prevBar) => prevBar + 1);
        return 1;
      } else {
        return prevCount + 1;
      }
    });
  }

  return (
    <>
      {/* time signuture dialog box */}
      <DialogBox open={timeSigDialogOpen} setOpen={setTimeSigDialogOpen}>
        <h1 className="mb-4 text-lg font-bold tracking-wide">Time Signuture</h1>

        <div className="grid grid-cols-2 gap-3 mx-4">
          {Array.from({ length: 8 }, (_el, index) => (
            <div key={index} onClick={() => setTimeSignature(index + 2)}>
              <div
                className={`flex flex-col w-16 h-16 aspect-square relative text-lg rounded-md px-3 py-1 bg-opacity-5 ${
                  index + 2 === timeSignature
                    ? "bg-white outline outline-2 outline-white"
                    : ""
                }`}
              >
                <span
                  className="w-full text-left font-semibold text-xl"
                  title={`${index + 2}`}
                >
                  {/* time signuture */}
                  {index + 2}
                </span>

                {/* static stuff */}
                <span className="h-[2px] w-8 absolute -rotate-45 bg-white opacity-50 left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4"></span>
                <span className="w-full text-right opacity-50">4</span>
              </div>
            </div>
          ))}
        </div>
      </DialogBox>

      <BarsSection
        timeSignuture={timeSignature}
        setTimeSignuture={setTimeSigDialogOpen}
        tickCount={tickCount}
        tempo={tempo}
      />

      {/* bar counter */}
      <div className="z-40 mt-6">
        <p
          className={`text-center text-4xl ${
            tickCount === 1 ? "text-cyan-400" : ""
          }`}
        >
          {tickCount}
        </p>
        <p>{bars} bars</p>
      </div>

      <PendulumContainer>
        {/* play button */}
        <button
          className={`absolute left-2/4 top-2/4 z-50 flex h-screen w-full -translate-x-2/4 -translate-y-2/4 items-center justify-center
            text-2xl font-bold text-white backdrop-blur-sm transition-opacity duration-300
            ${playing ? "opacity-0" : "opacity-100"}`}
          onClick={() => toggleMetronome()}
        >
          {/* round */}
          <div className="flex aspect-square w-[220px] items-center justify-center rounded-full border-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-16 w-16"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>

        <Pendulum
          tempo={tempo}
          playing={playing ? true : false}
          pendulumWeightPosition={pendulumWeightPosition}
          tickCount={tickCount}
        />
      </PendulumContainer>

      {/* controls */}
      <Controls
        tempo={tempo}
        setTempo={setTempo}
        minTempo={minTempo}
        maxTempo={maxTempo}
      />
    </>
  );
}
