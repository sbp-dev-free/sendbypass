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

import { Icon } from "../Icon";

import { Tab } from "./Tab";
import { TabProps, VerticalTabsProps } from "./types";

export const VerticalTabs = ({
  children,
  className,
  value,
  onChange,
}: VerticalTabsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 44 });

  useEffect(() => {
    if (containerRef.current) {
      const activeTab = containerRef.current.querySelector(
        "[data-active='true']",
      );
      if (activeTab) {
        const { offsetTop, offsetHeight } = activeTab as HTMLElement;
        setIndicatorStyle({ top: offsetTop, height: offsetHeight });
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
    <div className={cn("relative flex flex-col", className)} ref={containerRef}>
      <div
        className="absolute inset-2 bg-primary-opacity-8 opacity-[0.8] rounded-small transition-all duration-300 flex items-center justify-between pr-4"
        style={{
          left: "0",
          top: `${indicatorStyle.top}px`,
          height: `${44}px`,
        }}
      >
        <div className="w-4 h-16 bg-primary rounded-extra-small"></div>
        <Icon name="chevron-right-md" className="text-primary text-[20px]" />
      </div>
      {enhancedChildren}
    </div>
  );
};

VerticalTabs.Tab = Tab;
