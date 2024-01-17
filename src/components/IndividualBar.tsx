import { useRef, useEffect, useState, useContext } from "react";
import * as Tone from "tone";
import hh_regular from "/samples/hihat/hh_regular.mp3";
import hh_accented from "/samples/hihat/hh_accented.mp3";
import kick_regular from "/samples/kick/kick_regular.mp3";
import kick_accented from "/samples/kick/kick_accented.mp3";
import snare_regular from "/samples/snare/snare_regular.mp3";
import snare_accented from "/samples/snare/snare_accented.mp3";
import cowbell_accented from "/samples/cowbell/cowbell_accented.mp3";
import cowbell_regular from "/samples/cowbell/cowbell_regular.mp3";
import { useUpdatePrefrence } from "./Settings";

import { settingCtx } from "../App";
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
  const userPreference = useContext(settingCtx);

  const [tickSound, setTickSound] = useState({
    accent: hh_accented,
    regular: hh_regular,
  });

  const regularTickPlayer = useRef<null | CallableFunction>(null);
  const accentedTickPlayer = useRef<null | CallableFunction>(null);

  const [accented, setAccented] = useState(index == 0 ? true : false);

  //change the sound
  useEffect(() => {
    if (userPreference && userPreference.value) {
      switch (userPreference.value.sound) {
        case "HiHat":
          setTickSound({ accent: hh_accented, regular: hh_regular });
          break;

        case "kick":
          setTickSound({ accent: kick_accented, regular: kick_regular });
          break;

        case "snare":
          setTickSound({ accent: snare_accented, regular: snare_regular });
          break;

        case "cowbell":
          setTickSound({ accent: cowbell_accented, regular: cowbell_regular });
          break;

        default:
          setTickSound({ accent: hh_accented, regular: hh_regular });
          break;
      }
    }
  }, [userPreference]);

  //set up the tick
  useEffect(() => {
    const regularTick = new Tone.Player(tickSound.regular).toDestination();
    const accentedTick = new Tone.Player(tickSound.accent).toDestination();

    Tone.loaded().then(() => {
      regularTickPlayer.current = () => {
        regularTick.start();
      };

      accentedTickPlayer.current = () => {
        accentedTick.start();
      };
    });
  }, [tickSound]);

  const MinInMS = 60000;
  const oneEighth = MinInMS / tempo / 2;
  const oneTriplet = MinInMS / tempo / 3;
  const oneSixteenth = MinInMS / tempo / 4;

  const [dialogOpen, setDialogOpen] = useState(false);

  const possibleSubdivisons: { value: selectedSubdivisionType; img: string }[] =
    [
      { value: "mute", img: "notes/mute.png" },
      { value: "quarter", img: "notes/quarter-notes.png" },
      { value: "eighth", img: "notes/eighth-notes.png" },
      { value: "triplet", img: "notes/triplet-notes.png" },
      { value: "doted-triplet", img: "notes/doted-triplet-notes.png" },
      { value: "sixteenth", img: "notes/sixteenth-notes.png" },
      { value: "gallop", img: "notes/gallop-notes.png" },
      { value: "rev-gallop", img: "notes/reverse-gallop-notes.png" },
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

  type selectedSubdivisionType =
    | "mute"
    | "quarter"
    | "eighth"
    | "triplet"
    | "sixteenth"
    | "doted-triplet"
    | "gallop"
    | "rev-gallop";

  const [selectedSubdivision, setSelectedSubdivisons] =
    useState<selectedSubdivisionType>(getSubdivisionFromPrefrence());

  const playRegularTick = () => {
    if (regularTickPlayer.current) {
      regularTickPlayer.current();
    }
  };

  const playAccentTick = () => {
    if (accentedTickPlayer.current) {
      accentedTickPlayer.current();
    }
  };

  //on tick count , play the corresponding sound if the index of this instence is equal to the tick count
  useEffect(() => {
    if (tickCount === index + 1) {
      switch (selectedSubdivision) {
        //Mute
        case "mute":
          break;

        //Quarter Notes
        case "quarter":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }
          break;

        //Eight Notes
        case "eighth":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }

          setTimeout(() => {
            playRegularTick();
          }, oneEighth);
          break;

        //Triplet Notes
        case "triplet":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }

          setTimeout(() => {
            playRegularTick();
          }, oneTriplet);

          setTimeout(() => {
            playRegularTick();
          }, oneTriplet * 2);
          break;

        //Sixteenth Notes
        case "sixteenth":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth);

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth * 2);

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth * 3);
          break;

        //Doted Triplet Notes
        case "doted-triplet":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }

          setTimeout(() => {
            playRegularTick();
          }, oneTriplet * 2);
          break;

        //Forward Gallop
        case "gallop":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth);

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth * 2);

          break;

        //Reverse Gallop
        case "rev-gallop":
          if (!accented) {
            playRegularTick();
          } else {
            playAccentTick();
          }

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth * 2);

          setTimeout(() => {
            playRegularTick();
          }, oneSixteenth * 3);

          break;

        default:
          playRegularTick();
          break;
      }
    }
  }, [tickCount]);

  function toggleAccented() {
    setAccented((prev) => !prev);
  }

  function getSelectedSubdivisionImage() {
    const img = possibleSubdivisons.find(
      ({ value }) => value === selectedSubdivision
    )?.img;

    return img ? img : "quarter-notes.png";
  }

  function getSubdivisionFromPrefrence() {
    if (userPreference && userPreference.value) {
      const thisInstanceName = specials[index];
      const correspondingPreference = userPreference.value[thisInstanceName];

      if (correspondingPreference) {
        return correspondingPreference;
      } else {
        //default to quarter note
        return possibleSubdivisons[1].value;
      }
    } else {
      //default to quarter note
      return possibleSubdivisons[1].value;
    }
  }

  getSubdivisionFromPrefrence();

  //set the selected subdiv to the preference
  useEffect(() => {
    useUpdatePrefrence({
      ...userPreference?.value,
      [specials[index]]: selectedSubdivision,
    });
  }, [selectedSubdivision]);

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
            className="w-3 h-3 scale-x-[4] absolute -top-4 left-2/4 -translate-x-2/4"
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
          className={`h-full mx-auto notes-enter ${
            selectedSubdivision === "triplet" ? "scale-125" : "scale-100"
          }`}
          style={{
            animationDelay: `${50 * index}ms`,

            //increace the size of the image if its the dotted triplet image
            scale:
              getSelectedSubdivisionImage() === possibleSubdivisons[4].img
                ? "1.2"
                : "1",
          }}
          src={getSelectedSubdivisionImage()}
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

          <div className="grid grid-cols-2 gap-2 md:gap-4 mx-4">
            {/* mute subdivison */}

            {possibleSubdivisons.map(({ value, img }, i) => {
              return (
                <span
                  className={`flex flex-col justify-between items-center gap-4 text-center px-4 py-2 rounded-md bg-opacity-5 transition-all duration-150
                  ${
                    selectedSubdivision === value
                      ? "bg-white outline outline-2 outline-white"
                      : "opacity-60"
                  }`}
                  onClick={() => setSelectedSubdivisons(value)}
                  key={i}
                >
                  <img
                    src={img}
                    className="h-10 md:h-12 max-w-xs col-span-full"
                    style={{
                      //increace the size of the image if its the dotted triplet image
                      scale: img === possibleSubdivisons[4].img ? "1.4" : "1",
                    }}
                  />
                  <h3>{value}</h3>
                </span>
              );
            })}
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
