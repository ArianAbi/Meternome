import { useRef, useEffect, useState } from "react";
import * as Tone from "tone";
import rideSample from "/samples/ride/new-ride.wav";
import DialogBox from "./DialogBox";

interface IndividualBar {
  index: number;
  tickCount: number;
  tempo: number;
  timeSigniture: number;
}

export default function IndividualBar({
  index,
  tickCount,
  tempo,
}: IndividualBar) {
  const playRef = useRef<null | CallableFunction>(null);
  const [accented, setAccented] = useState(index == 0 ? true : false);

  //set up the tick
  useEffect(() => {
    const tick = new Tone.Player(rideSample).toDestination();

    Tone.loaded().then(() => {
      playRef.current = () => {
        tick.start();
      };
    });
  }, []);

  const MinInMS = 60000;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [subdivisons, setSubdivisons] = useState(1);

  let subdivisonTiming = MinInMS / tempo / subdivisons;

  const playTick = () => {
    if (playRef.current) {
      playRef.current();
    }
  };

  const noteImages = [
    "mute.png",
    "quarter-notes.png",
    "eighth-notes.png",
    "triplet-notes.png",
    "sixteenth-notes.png",
    "doted-triplet-notes.png",
  ];

  const specials = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
  ];

  useEffect(() => {
    if (tickCount === index + 1) {
      switch (subdivisons) {
        //Mute
        case 0:
          break;

        //Quarter Notes
        case 1:
          playTick();
          break;

        //Eight Notes
        case 2:
          playTick();

          setTimeout(() => {
            playTick();
          }, subdivisonTiming);
          break;

        //Triplet Notes
        case 3:
          playTick();

          setTimeout(() => {
            playTick();
          }, subdivisonTiming);

          setTimeout(() => {
            playTick();
          }, subdivisonTiming * 2);
          break;

        //Sixteenth Notes
        case 4:
          playTick();

          setTimeout(() => {
            playTick();
          }, subdivisonTiming);

          setTimeout(() => {
            playTick();
          }, subdivisonTiming * 2);

          setTimeout(() => {
            playTick();
          }, subdivisonTiming * 3);
          break;

        //Doted Eight Notes
        case 5:
          playTick();

          setTimeout(() => {
            playTick();
          }, subdivisonTiming * 2);
          break;

        default:
          playTick();
          break;
      }
    }
  }, [tickCount]);

  function toggleAccented() {
    setAccented((prev) => !prev);
  }

  return (
    <>
      <button
        onClick={() => setDialogOpen(true)}
        className={`relative my-2 px-0 text-center text-white w-full ${
          dialogOpen ? "active-bar" : ""
        }`}
        key={index}
      >
        {/* if accented show a mark */}
        {accented && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3 scale-x-[4] absolute -top-3 left-2/4 -translate-x-2/4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        )}

        {/* note svg */}
        <img
          className={`h-full mx-auto notes-enter
          ${
            //increase the image scale if its doted eigth image
            subdivisons === 5 ? "scale-150" : ""
          }`}
          style={{ animationDelay: `${50 * index}ms` }}
          src={noteImages[subdivisons]}
        />
        {/* tick counter arrow */}
        {tickCount === index + 1 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute left-2/4 -translate-x-2/4 z-[-1] h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <DialogBox open={dialogOpen} setOpen={setDialogOpen}>
        <div className="flex flex-col gap-4">
          <span className="mb-4 text-lg font-bold tracking-wide text-center">
            {specials[index]} bar Subdivisons
          </span>

          {/* mute subdivison */}
          <div className="grid grid-cols-2 gap-8 mx-4">
            <span
              className="flex flex-col justify-between items-center gap-4 text-center"
              onClick={() => setSubdivisons(0)}
            >
              <img src="mute.png" className="w-9 h-12 col-span-full" />

              <input type="radio" checked={subdivisons === 0} readOnly />
            </span>

            {/* Quarter subdivison */}
            <span
              className="flex flex-col justify-between items-center gap-4 text-center"
              onClick={() => setSubdivisons(1)}
            >
              <img src="quarter-notes.png" className="w-10 h-12" />

              <input type="radio" checked={subdivisons === 1} readOnly />
            </span>

            {/* Eighth subdivison */}
            <span
              className="flex flex-col justify-between items-center gap-4 text-center"
              onClick={() => setSubdivisons(2)}
            >
              <img src="eighth-notes.png" className="w-10 h-12" />
              <input type="radio" checked={subdivisons === 2} readOnly />
            </span>

            {/* Triplet subdivison */}
            <span
              className="flex flex-col justify-between items-center gap-4 text-center"
              onClick={() => setSubdivisons(3)}
            >
              <img src="triplet-notes.png" className="w-14 h-12" />

              <input type="radio" checked={subdivisons === 3} readOnly />
            </span>

            {/* Doted Triplet subdivison */}
            <span
              className="flex flex-col justify-between items-center gap-4 text-center"
              onClick={() => setSubdivisons(5)}
            >
              <img src="doted-triplet-notes.png" className="w-14 h-14" />

              <input type="radio" checked={subdivisons === 5} readOnly />
            </span>

            {/* Sixteenth subdivison */}
            <span
              className="flex flex-col justify-between items-center gap-4 text-center"
              onClick={() => setSubdivisons(4)}
            >
              <img src="sixteenth-notes.png" className="w-16 h-12 " />

              <input type="radio" checked={subdivisons === 4} readOnly />
            </span>
          </div>
        </div>

        <div
          className="w-full flex justify-center gap-2 mt-2"
          onClick={toggleAccented}
        >
          <input readOnly checked={accented} type="checkbox" />
          <label>Accented</label>
        </div>
      </DialogBox>
    </>
  );
}
