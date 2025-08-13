import { FC, MouseEvent, useRef } from "react";

import Chip from "@mui/material/Chip";
import { useRouter } from "nextjs-toploader/app";
import { useLocalStorage } from "usehooks-ts";

import { Icon } from "@/components/shared/Icon";
import { getOptionLabel } from "@/components/shared/LocationAutocomplete/renderers";
import { ROUTES } from "@/constants";
import { DESKTOP_TABS } from "@/constants/home";
import { cn } from "@/utils";

import { SearchHistoryItem } from "./types";

export const RecentSearch: FC = () => {
  const { push } = useRouter();

  const [searchHistory, setSearchHistory] = useLocalStorage<
    SearchHistoryItem[]
  >("searchHistory", [], { initializeWithValue: false });

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.dataset.isDragging = "true";
    container.dataset.startX = `${e.pageX - container.offsetLeft}`;
    container.dataset.scrollLeftStart = `${container.scrollLeft}`;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || container.dataset.isDragging !== "true") return;

    e.preventDefault();
    const startX = parseFloat(container.dataset.startX || "0");
    const scrollLeftStart = parseFloat(
      container.dataset.scrollLeftStart || "0",
    );
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.dataset.isDragging = "false";
    }
  };

  const handleDeleteHistory = (index: number) => {
    setSearchHistory((prevHistory) =>
      prevHistory.filter((_, i) => i !== index),
    );
  };

  const handleClick = ({ tab, from, to }: SearchHistoryItem) => {
    let path = "";
    const params = new URLSearchParams();
    const fromTag = from?.value;
    const toTag = to?.value;

    if (fromTag) params.append("from_location", fromTag);
    if (toTag) params.append("to_location", toTag);

    switch (tab) {
      case DESKTOP_TABS[0].value:
        path = ROUTES.connectHub.requestToPassengers;
        break;
      case DESKTOP_TABS[1].value:
        path = ROUTES.connectHub.startToShop;
        break;
      case DESKTOP_TABS[2].value:
        path = ROUTES.connectHub.startToShip;
        break;
      default:
        return;
    }
    push(`${path}?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "flex gap-16 items-center text-on-surface md:text-inverse-on-surface",
        { hidden: !searchHistory.length },
      )}
    >
      <div className="flex gap-6 items-center">
        <Icon name="Clockwise Clock redo" />
        <span className="hidden whitespace-nowrap text-body-medium md:block">
          Recent searches
        </span>
      </div>
      <div
        className="flex overflow-x-scroll gap-6 items-center hide-scrollbar"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        style={{ cursor: "grab" }}
      >
        {searchHistory.map((history, index) => (
          <Chip
            key={index}
            label={`${getOptionLabel(history.from)} to ${getOptionLabel(history.to)}`}
            variant="outlined"
            className="!h-24 !flex-row-reverse !border-none !bg-surface-dim md:!bg-background-opacity-16 !text-on-surface md:!text-inverse-on-surface !text-label-medium"
            deleteIcon={
              <Icon
                name="Close remove"
                className="text-[16px] !text-inverse-on-surface !-mr-4"
              />
            }
            onDelete={() => handleDeleteHistory(index)}
            onClick={() => handleClick(history)}
          />
        ))}
      </div>
    </div>
  );
};
