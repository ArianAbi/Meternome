import { type Dispatch, type SetStateAction } from "react";
import IndividualBar from "./IndividualBar";
import "../global.css";
import "../active-bar.css";

interface NotesSection {
  setTimeSignuture: Dispatch<SetStateAction<boolean>>;
  timeSignuture: number;
  tickCount: number;
  tempo: number;
}

export default function BarsSection({
  timeSignuture,
  setTimeSignuture,
  tickCount,
  tempo,
}: NotesSection) {
  return (
    <>
      <div className="z-50 mt-4 flex h-12 w-full justify-between  md:h-16">
        {/* time signuture */}
        <button
          onClick={() => setTimeSignuture(true)}
          className="flex h-full w-16 flex-col  items-center justify-between border-r-[1px] text-center text-lg text-white relative"
        >
          {timeSignuture}

          {/* select arrow  */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="absolute right-1 top-1/4 h-6 w-4 -translate-y-1/2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
          <hr className="w-3/5" />
          <span>4</span>
        </button>

        {/* single notes container */}
        <div className="flex justify-between w-full md:px-16 md:gap-2">
          {Array.from({ length: timeSignuture }, (_el, index) => (
            <IndividualBar
              index={index}
              tickCount={tickCount}
              tempo={tempo}
              key={index}
              timeSigniture={timeSignuture}
            />
          ))}
        </div>
      </div>
    </>
  );
}
