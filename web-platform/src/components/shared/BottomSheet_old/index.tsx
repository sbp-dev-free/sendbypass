"use client";

import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Drawer from "@mui/material/Drawer";

import { cn, parseHeight } from "@/utils";

import { BottomSheetProps } from "./types";

export const BottomSheet = ({
  open,
  initialHeight,
  children,
  className,
  sheetClassName,
  toggle,
  ...rest
}: BottomSheetProps) => {
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  const [drawerHeight, setDrawerHeight] = useState(() =>
    parseHeight(windowHeight, initialHeight),
  );
  const isDragging = useRef(false);
  const startY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const delta = startY.current - clientY;
      const newHeight = Math.min(
        Math.max(0, drawerHeight + delta),
        windowHeight,
      );

      setDrawerHeight(newHeight);
      startY.current = clientY;
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;

      isDragging.current = false;

      if (windowHeight - drawerHeight <= 300) {
        setDrawerHeight(windowHeight);
      } else if (drawerHeight <= 200) {
        toggle(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [drawerHeight, windowHeight]);

  useEffect(() => {
    return () => {
      document.body.style.userSelect = "auto";
    };
  }, []);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setDrawerHeight(parseHeight(windowHeight, initialHeight));
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [open, initialHeight]);

  const handleMouseDown = (e: ReactMouseEvent | ReactTouchEvent) => {
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    isDragging.current = true;

    document.body.style.userSelect = "none";
  };

  return (
    <Drawer
      {...rest}
      open={open}
      onClose={() => toggle(false)}
      anchor="bottom"
      PaperProps={{
        style: {
          height: `${drawerHeight}px`,
          maxHeight: "100%",
          overflow: "hidden",
          transition: isDragging.current ? "none" : "height 0.3s ease",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
        },
      }}
      className={sheetClassName}
    >
      <div
        className="flex justify-center pt-20 cursor-grab"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="w-64 h-4 rounded-full bg-outline" />
      </div>

      <div className={cn("mt-20 h-full overflow-y-auto", className)}>
        {children}
      </div>
    </Drawer>
  );
};
