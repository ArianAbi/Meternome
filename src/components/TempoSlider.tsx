import { ChangeEvent, useEffect } from "react";
import "../TempoSlider.css";

interface TempoSlider {
  value: number;
  max: number;
  min: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function TempoSlider({
  value,
  min,
  max,
  onChange,
}: TempoSlider) {
  const valueDiff = value - min;
  const maxDiff = max - min;
  const ratio = valueDiff / maxDiff;
  const thumbPosition = ratio * 100;

  //update the input
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--slider-width",
      `${thumbPosition}%`
    );
  }, [value]);

  return (
    <>
      <div className="my-4 w-full relative">
        <input
          value={value}
          min={min}
          max={max}
          onChange={onChange}
          className="h-full w-full tempo-slider"
          type="range"
        />
      </div>
    </>
  );
}
