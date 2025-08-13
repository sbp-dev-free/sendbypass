import { useState } from "react";

import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import dayjs from "dayjs";

import { AppProfile, Icon } from "@/components/shared";

import { OrderCardProps } from "../../types";

const dotOutline = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="none"
    className="stroke-primary"
  >
    <circle cx="6" cy="6" r="4" fill="white" strokeWidth="2" />
  </svg>
);
const dotFilled = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="none"
    className="fill-outline-variant"
  >
    <circle cx="6" cy="6" r="4" strokeWidth="2" />
  </svg>
);
export const OrderTimeLine = (props: OrderCardProps) => {
  const [showRouteDetails, setShowRouteDetails] = useState(false);

  const trip = props.order.order_flight_data;
  const destination = trip.destination_data.city;
  const source = trip.source_data.city;
  const flight = trip.flight;

  return (
    <div className="border border-surface-container-high rounded-medium ">
      <div className="bg-surface-container-high p-8 pr-16 rounded-tl-medium rounded-tr-medium">
        <div className="flex justify-between items-center">
          <AppProfile
            profile={props.order.order_traveler_sender}
            role={props.order.order_role}
          />
          <Icon name="messages" className="text-[24px] text-primary" />
        </div>
      </div>
      <div className="p-12 flex justify-between md:hidden">
        <div
          className="text-label-medium text-on-surface flex items-center"
          role="button"
          onClick={() => setShowRouteDetails(!showRouteDetails)}
        >
          Route details
          <Icon
            name="caret down md"
            className={`text-[20px] text-on-surface transition-transform duration-200 ${
              showRouteDetails ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
        <div className="min-w-[140px] flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="w-8 h-8 border-2 border-primary rounded-full"></div>
            <div className="text-on-surface text-label-small">
              {props.order.order_origin}
            </div>
          </div>
          <hr className="border-t border-dashed border-outline-variant w-full mx-2" />
          <div className="flex gap-4 items-center">
            <div className="text-on-surface text-label-small">
              {props.order.order_destination}
            </div>
            <Icon name="location" className="text-[16px] text-primary"></Icon>
          </div>
        </div>
      </div>
      <div className="md:flex hidden pt-[10px]">
        <Timeline
          position="right"
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          <TimelineItem sx={{ minHeight: 40 }}>
            <TimelineSeparator>
              {dotOutline}
              <TimelineConnector className="p-0 !bg-transparent !border-dashed border-outline-variant border" />
            </TimelineSeparator>
            <div className="text-label-medium-prominent ml-20">{source}</div>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: 40 }}>
            <TimelineSeparator>
              {dotFilled}
              <TimelineConnector className="p-0 !bg-transparent !border-dashed border-outline-variant border" />
            </TimelineSeparator>
            <div className=" ml-20 flex-col -translate-y-[10px]">
              <div className="flex gap-6">
                <span className="text-label-medium-prominent">
                  {flight.source.location_data.city}
                </span>
                <span className="text-label-small text-outline">
                  {flight.source.location_data.airport.name} (
                  {flight.source.location_data.airport.airport_code})
                </span>
              </div>
              <div className="flex gap-6">
                <span className="text-label-medium-prominent">
                  {dayjs(flight.source.to).format("H : MM")}
                </span>
                <span className="text-label-small text-outline">
                  {dayjs(flight.source.to).format("ddd DD MMM")}
                </span>
              </div>
            </div>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: 40 }}>
            <TimelineSeparator>
              {dotFilled}
              <TimelineConnector className="p-0 !bg-transparent !border-dashed border-outline-variant border-[1px]" />
            </TimelineSeparator>
            <div className=" ml-20 flex-col -translate-y-[10px]">
              <div className="flex gap-6">
                <span className="text-label-medium-prominent">
                  {flight.destination.location_data.city}
                </span>
                <span className="text-label-small text-outline">
                  {flight.destination.location_data.airport.name} (
                  {flight.destination.location_data.airport.airport_code})
                </span>
              </div>
              <div className="flex gap-6">
                <span className="text-label-medium-prominent">
                  {dayjs(flight.destination.to).format("H : MM")}
                </span>
                <span className="text-label-small text-outline">
                  {dayjs(flight.destination.to).format("ddd DD MMM")}
                </span>
              </div>
            </div>{" "}
          </TimelineItem>
          <TimelineItem sx={{ minHeight: 40 }}>
            <TimelineSeparator>
              <Icon
                name="location-2"
                className="text-primary fill-primary -translate-x-2"
              />
            </TimelineSeparator>
            <div className="text-label-medium-prominent ml-[17px]">
              {destination}
            </div>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  );
};
