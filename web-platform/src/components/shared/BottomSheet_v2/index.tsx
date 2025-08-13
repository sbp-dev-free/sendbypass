"use client";

import React, { useEffect } from "react";

import { type DialogProps } from "@mui/material/Dialog";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import ReactDOM from "react-dom";

export const BottomSheet: React.FC<
  Partial<DialogProps & { onClose: () => void }>
> = ({
  open,
  onClose,
  hideBackdrop = false,
  disablePortal = false,
  children,
  disableScrollLock = false,
}) => {
  const drawerVariants = {
    open: { y: 0 },
    closed: { y: "100%" },
  };

  const controls = useDragControls();

  useEffect(() => {
    if (open && !disableScrollLock) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, disableScrollLock]);

  if (typeof window === "undefined") return null;

  const core = (
    <AnimatePresence mode="wait">
      {open && (
        <div
          id="app-portal"
          className="fixed bottom-0 left-0 right-0 z-[10000001] h-full"
          role="presentation"
        >
          <motion.div
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 0.3 }}
            role="presentation"
          >
            {/* Backdrop */}
            {!hideBackdrop && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 bg-on-surface-variant-opacity-50"
                onClick={onClose}
              ></div>
            )}

            <motion.div
              className="relative mt-auto w-full bg-surface-container-lowest rounded-t-lg shadow-bottom-sheet rounded-t-extra-large flex flex-col "
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) {
                  onClose?.();
                }
              }}
              dragElastic={{ top: 0, bottom: 0.7 }}
              dragSnapToOrigin
              dragListener={false}
              dragControls={controls}
            >
              <div
                onPointerDown={(event) => !!onClose && controls.start(event)}
                className="flex items-center justify-center h-[44px] w-full cursor-grab"
                style={{ touchAction: "none" }}
              >
                <div className="w-32 h-4 rounded-full bg-outline" />
              </div>

              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (disablePortal) return core;

  // Ensure the portal attaches to the end of the body element
  const bodyElement = document.body;
  return ReactDOM.createPortal(core, bodyElement);
};
