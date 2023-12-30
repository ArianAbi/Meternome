import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface Pendulum {
  tempo: number;
  playing: boolean;
  pendulumWeightPosition: number;
  tickCount: number;
}

export function Pendulum({ tempo, playing, pendulumWeightPosition }: Pendulum) {
  return (
    <>
      <motion.div
        className="absolute bottom-0 origin-bottom left-2/4"
        initial={{ rotateZ: 0, translateX: "-50%", translateY: "1rem" }}
        animate={{ rotateZ: playing ? [-20, 20] : 0 }}
        transition={{
          repeat: playing ? Infinity : 0,
          duration: 60 / tempo,
          repeatType: "mirror",
          ease: "easeIn",
        }}
      >
        {/* pendulum */}
        <div
          className="w-3 h-[320px] bg-stone-500 absolute bottom-0 left-2/4 -translate-x-2/4 rounded-t-sm"
          style={{ boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.5)" }}
        >
          {/* weight */}
          <img
            className="absolute w-12 left-2/4 -translate-x-2/4 max-w-none "
            style={{ top: `${pendulumWeightPosition}%` }}
            src="/Metronome/Weight.svg"
            alt="pendulum-weight"
          />
        </div>
      </motion.div>

      {/* metronome background */}
      <img
        className="absolute bottom-0 left-2/4 -z-10 max-w-none -translate-x-2/4"
        src="Metronome/Body.svg"
        alt="metronome background"
      />
    </>
  );
}

export function PendulumContainer({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full origin-bottom scale-95 sm:scale-100 lg:scale-125">
      {children}
    </div>
  );
}
