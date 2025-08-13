"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/utils";

import { Tab } from "./Tab";
import { RoundedTabListProps, TabProps } from "./types";

export const RoundedTabList = ({
  children,
  className,
  value,
  onChange,
}: RoundedTabListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const activeTab = containerRef.current.querySelector(
        "[data-active='true']",
      );
      if (activeTab) {
        const { offsetLeft, offsetWidth } = activeTab as HTMLElement;
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    }
  }, [value, children]);

  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement<TabProps>(child) && child.type === Tab) {
      return cloneElement(child, {
        "data-active": child.props.value === value ? "true" : "false",
        onClick: () => onChange?.(child.props.value),
      });
    }
    return child;
  });

  return (
    <div
      className={cn(
        "relative flex gap-2 p-2 rounded-full bg-surface-container-high w-fit",
        className,
      )}
      ref={containerRef}
    >
      <div
        className="absolute inset-2 rounded-full transition-all duration-300 bg-surface-container-lowest"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />
      {enhancedChildren}
    </div>
  );
};

RoundedTabList.Tab = Tab;
