import { motion, AnimatePresence } from "framer-motion";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface DialogBox {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function DialogBox({ open, setOpen, children }: DialogBox) {
  function CloseDialog() {
    setOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={CloseDialog}
            className="absolute left-0 top-0 z-[99] flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-3 rounded-md bg-black bg-opacity-95 px-4 pb-6 pt-4"
              style={{ boxShadow: "0px 0px 5px 2px #ffffff5a" }}
              initial={{ scale: 0.2 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
