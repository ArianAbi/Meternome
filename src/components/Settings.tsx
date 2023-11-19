import { useEffect, useState } from 'react';

export type userPreference = {
  sound: 'sound1' | 'sound2' | 'sound3';
  backgroundTick: boolean;
  onlyTickOnAccents: boolean;
  regularTickBgColor: string;
  accentTickBgColor: string;
  regularTickBgEnabled: boolean;
  accentTickBgٍEnabled: boolean;
};

export default function Settings() {
  const [sound, setSound] = useState('sound1');
  const [backgroundTick, setBackgroundTick] = useState(false);
  const [onlyTickOnAccents, setOnlyTickOnAccents] = useState(false);

  const [regularTickBgColor, setRegularTickBgColor] = useState('#5f5faf');
  const [accentTickBgColor, setAccentTickBgColor] = useState('#fd4444');

  const [regularTickBgEnabled, setRegularTickBgEnabled] = useState(true);
  const [accentTickBgٍEnabled, setAccentTickBgEnabled] = useState(true);

  function handleSoundChange(sound: 'sound1' | 'sound2' | 'sound3') {
    setSound(sound);
  }

  const userPreference = {
    sound,
    backgroundTick,
    onlyTickOnAccents,
    regularTickBgColor,
    accentTickBgColor,
    regularTickBgEnabled,
    accentTickBgٍEnabled,
  };

  // apply the saved preference if it exsists
  useEffect(() => {
    if (localStorage.getItem('userPreference')) {
      const preferenceStringy = localStorage.getItem('userPreference');
      if (!preferenceStringy) {
        return;
      }

      const preference: userPreference = JSON.parse(preferenceStringy);

      setSound(preference.sound);
      setBackgroundTick(preference.backgroundTick);
      setOnlyTickOnAccents(preference.onlyTickOnAccents);
      setAccentTickBgColor(preference.accentTickBgColor);
      setAccentTickBgEnabled(preference.accentTickBgٍEnabled);
      setRegularTickBgColor(preference.regularTickBgColor);
      setRegularTickBgEnabled(preference.regularTickBgEnabled);
    }
  }, []);

  useEffect(() => {
    const stringifyPreference = JSON.stringify(userPreference);
    localStorage.setItem('userPreference', stringifyPreference);
  }, [userPreference]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 px-2">
        <div className="w-full">
          <ol>
            <h2 className="mb-2 text-base font-semibold">Tick Sound</h2>
            <li
              className="ml-4 flex gap-1"
              onClick={() => handleSoundChange('sound1')}
            >
              <input
                type="radio"
                name="tickSound"
                value="sound1"
                checked={sound === 'sound1'}
                readOnly
              />
              <label>Tick Sound 1</label>
            </li>
            <li
              className="ml-4 flex gap-1"
              onClick={() => handleSoundChange('sound2')}
            >
              <input
                type="radio"
                name="tickSound"
                value="sound2"
                checked={sound === 'sound2'}
                readOnly
              />
              <label>Tick Sound 2</label>
            </li>
            <li
              className="ml-4 flex gap-1"
              onClick={() => handleSoundChange('sound3')}
            >
              <input
                type="radio"
                name="tickSound"
                value="sound3"
                checked={sound === 'sound3'}
                readOnly
              />
              <label>Tick Sound 3</label>
            </li>
          </ol>
        </div>

        <div className="w-full">
          <h2 className="mb-2 text-base font-semibold">Background Click</h2>

          <div
            className="ml-4 flex gap-1"
            onClick={() => setBackgroundTick((prev) => !prev)}
          >
            <input type="checkbox" checked={backgroundTick} readOnly />
            <span>Background Click</span>
          </div>

          <div
            className={`ml-4 flex gap-1 ${
              !backgroundTick ? 'text-gray-400' : ''
            }`}
            onClick={() => setOnlyTickOnAccents((prev) => !prev)}
          >
            <input
              type="checkbox"
              disabled={!backgroundTick}
              checked={onlyTickOnAccents}
            />
            <span>Click Only on Accents</span>
          </div>

          <div className="mt-2 flex gap-6 text-center">
            <div className="flex flex-col items-center justify-center gap-1">
              <h2
                className={`font-semibold ${
                  !accentTickBgٍEnabled ? 'text-gray-400' : ''
                }`}
              >
                Accent Color
              </h2>
              <input
                disabled={!accentTickBgٍEnabled}
                type="color"
                value={accentTickBgColor}
                onChange={(e) => setAccentTickBgColor(e.target.value)}
              />

              <div onClick={() => setAccentTickBgEnabled((prev) => !prev)}>
                <input
                  type="checkbox"
                  checked={accentTickBgٍEnabled}
                  readOnly
                />
                <span className="ml-1">Enabled</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <h2
                className={`font-semibold ${
                  !regularTickBgEnabled ? 'text-gray-400' : ''
                }`}
              >
                Regular Color
              </h2>
              <input
                disabled={!regularTickBgEnabled}
                type="color"
                value={regularTickBgColor}
                onChange={(e) => setRegularTickBgColor(e.target.value)}
              />

              <div onClick={() => setRegularTickBgEnabled((prev) => !prev)}>
                <input
                  type="checkbox"
                  checked={regularTickBgEnabled}
                  readOnly
                />
                <span className="ml-1">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
