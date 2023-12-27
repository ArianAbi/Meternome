import { useState, useEffect, useContext } from "react";
import Controls from "./components/Controls";
import { Pendulum, PendulumContainer } from "./components/Pendulum";
import DialogBox from "./components/DialogBox";
import BarsSection from "./components/BarsSection";
import Settings, { type userPreference } from "./components/Settings";
import { settingCtx } from "./App";

export default function Metronome() {
  const setting = useContext(settingCtx);

  const minTempo = 20;
  const maxTempo = 320;

  const [metronome, setMetronome] = useState<null | number>(null);
  const [pendulumWeightPosition, setPendulumWeightPosition] = useState(0);

  const [tickCount, setTickCount] = useState(0);

  const [tempo, setTempo] = useState(120);
  const [bars, setBars] = useState(0);

  const [timeSigniture, setTimeSignuture] = useState(4);
  const [timeSigDialogOpen, setTimeSigDialogOpen] = useState(false);
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);

  const msInMinute = 60000;
  const tickDuration = msInMinute / tempo;

  //on tempo or time signuture change update the interval
  useEffect(() => {
    // calculate pendulum position
    const ratio = 0.7;
    setPendulumWeightPosition(((tempo * 100) / maxTempo) * ratio);

    // reset the metronome
    if (metronome) {
      clearInterval(metronome);
      setMetronome(null);

      setTimeout(() => {
        setMetronome(setInterval(tickMetronome, tickDuration));
      }, 10);
    }
  }, [tempo, timeSigniture]);

  function toggleMetronome() {
    //start if we dont have a metronome
    if (!metronome) {
      setBars(0);
      setMetronome(setInterval(tickMetronome, tickDuration));
      return;
    }

    //else stop the metronome
    setTickCount(0);
    clearInterval(metronome);
    setMetronome(null);
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
  }, [metronome]);

  function tickMetronome() {
    setTickCount((prevCount) => {
      if (prevCount >= timeSigniture) {
        setBars((prevBar) => prevBar + 1);
        return 1;
      } else {
        return prevCount + 1;
      }
    });
  }

  function handleTimeSignutureChange(timeSigniture: number) {
    setTimeSignuture(timeSigniture);
  }

  function getTickBackground(settings: userPreference) {
    if (tickCount === 1) {
      return settings.accentTickBgColor;
    } else {
      if (!settings.onlyTickOnAccents) {
        return settings.regularTickBgColor;
      }
    }
  }

  function getTheLightness(tickCount: number) {
    let brightness = 100;
    let decreaseAmount = 0;

    const decreaseStep = 100 / (timeSigniture + 1);

    if (tickCount != 1) {
      decreaseAmount = Math.floor(decreaseStep * tickCount - decreaseStep * 2);
    }

    return `${brightness - decreaseAmount}%`;
  }

  return (
    <>
      {/* background tick */}
      {setting &&
        setting.value &&
        setting.value.backgroundTick &&
        tickCount > 0 && (
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              background: getTickBackground(setting.value),

              // decrease the lightness of the background with every tick
              filter: `brightness(${getTheLightness(tickCount)})`,
            }}
          ></div>
        )}

      <div className="mx-auto flex h-[100svh] max-w-screen-md flex-col items-center">
        {/* title */}
        <header className="z-50 mb-2 flex w-full items-center justify-between px-4 py-3 text-center text-xl font-bold">
          <a
            href="https://github.com/ArianAbi/MeternomeVite"
            title="github page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="white"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          <h1>Metronome</h1>

          <button onClick={() => setSettingDialogOpen(true)} title="settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 scale-[1.2]"
            >
              <path
                fillRule="evenodd"
                className="h-full w-full"
                d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </header>
        <hr className="w-4/6 border-[1px] border-white md:w-full z-10" />

        {/* settings dialog box */}
        <DialogBox open={settingDialogOpen} setOpen={setSettingDialogOpen}>
          <span className="mb-4 text-lg font-bold tracking-wide">Settings</span>

          <Settings />
        </DialogBox>

        {/* time signuture dialog box */}
        <DialogBox open={timeSigDialogOpen} setOpen={setTimeSigDialogOpen}>
          <h1 className="mb-4 text-lg font-bold tracking-wide">
            Time Signuture
          </h1>

          {Array.from({ length: 7 }, (_el, index) => (
            <div
              className="flex w-full gap-2 text-lg font-bold"
              key={index}
              onClick={() => handleTimeSignutureChange(index + 2)}
            >
              <input
                type="radio"
                name="timeSig"
                checked={index + 2 === timeSigniture}
                value={index + 2}
                readOnly
              />
              <label title={`${index + 2}`}>{index + 2}</label>
              <img src="/quarter-notes.png" className="h-5" />
            </div>
          ))}
        </DialogBox>

        <BarsSection
          timeSignuture={timeSigniture}
          setTimeSignuture={setTimeSigDialogOpen}
          tickCount={tickCount}
          tempo={tempo}
        />

        {/* bar counter */}
        <div className="z-50 mt-6">
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
            className={`absolute left-2/4 top-2/4 z-50 flex h-full w-full -translate-x-2/4 -translate-y-2/4 items-center justify-center
            text-2xl font-bold text-white backdrop-blur-sm transition-opacity duration-300
            ${metronome ? "opacity-0" : "opacity-100"}`}
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
            playing={metronome ? true : false}
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
      </div>
    </>
  );
}
