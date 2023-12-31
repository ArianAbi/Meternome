import { useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";
import useClamp from "../hooks/useClamp";
import TempoSlider from "./TempoSlider";

interface Controls {
  tempo: number;
  setTempo: Dispatch<SetStateAction<number>>;
  minTempo: number;
  maxTempo: number;
}

export default function Controls({
  tempo,
  setTempo,
  minTempo,
  maxTempo,
}: Controls) {
  const [tappedTempo, setTappedTempo] = useState(0);
  const [prevNow, setPrevNow] = useState(0);

  function AdjustTempo(value: number) {
    setTempo((prev) => {
      if (tempo >= maxTempo) {
        if (value < 0) {
          return prev + value;
        }
        return prev;
      }

      if (tempo <= minTempo) {
        if (value > 0) {
          return prev + value;
        }
        return prev;
      }

      return prev + value;
    });
  }

  function HandleTapTempo() {
    setPrevNow(Date.now());
    setTappedTempo(Date.now() - prevNow);

    const calculatedTempo = Math.round(60000 / tappedTempo);

    setTempo(useClamp(20, 320, calculatedTempo));
  }

  return (
    <>
      <div className="z-10 flex w-full flex-col items-center justify-center bg-[#001b2a] pb-4 pt-2 sm:pb-8 sm:pt-4 md:rounded-t-3xl">
        <div className="flex h-full w-full items-center justify-center px-12">
          {/* minus button */}
          <motion.button
            whileTap={{ scale: 1.5 }}
            className="text-white h-8 aspect-square text-3xl mr-2 origin-center flex items-center justify-start"
            onClick={() => AdjustTempo(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </motion.button>

          <TempoSlider
            min={minTempo}
            max={maxTempo}
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
          />

          {/* plus button */}
          <motion.button
            whileTap={{ scale: 1.5 }}
            className="text-white h-8 aspect-square text-3xl ml-2 origin-center flex items-center justify-end"
            onClick={() => AdjustTempo(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </motion.button>
        </div>

        <span className="text-base px-6 mb-4 text-left">Tempo : {tempo}</span>

        <button
          className=" bg-cyan-600 px-6 py-4 tracking-wider rounded-md text-sm font-semibold "
          onClick={HandleTapTempo}
        >
          Tap the Tempo
        </button>
      </div>
    </>
  );
}
