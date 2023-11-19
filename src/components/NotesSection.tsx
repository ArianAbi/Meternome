import type { Dispatch, SetStateAction } from 'react';

interface NotesSection {
  setTimeSignuture: Dispatch<SetStateAction<boolean>>;
  timeSignuture: number;
  tickCount: number;
}

export default function NotesSection({
  timeSignuture,
  setTimeSignuture,
  tickCount,
}: NotesSection) {
  return (
    <>
      <div className=" relative z-50 mt-4 flex h-12 w-full justify-around  gap-4 pl-[4.5rem] pr-4 sm:pr-12 md:h-16">
        {/* time signuture */}
        <button
          onClick={() => setTimeSignuture(true)}
          className="absolute left-0 flex  h-full w-16 flex-col  items-center justify-between border-r-[1px] text-center text-lg text-white"
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

        {Array.from({ length: timeSignuture }, (el, index) => (
          <div
            className="relative my-2 px-0 text-center text-white"
            key={index}
          >
            {/* note svg */}
            <img className="h-full " src="/quarter-note.svg" />

            {/* up arrow svg */}
            {tickCount === index + 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute z-[-1] h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
