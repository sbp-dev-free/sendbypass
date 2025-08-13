import React from "react";

import { CircleSegmentProgressProps } from "./types";

export const CircleSegmentProgress: React.FC<CircleSegmentProgressProps> = ({
  steps = 5,
  currentStep = 2,
  radius = 11,
  strokeWidth = 4,
  filledColor = "#B26318",
  emptyColor = "#CBC4D0",
  gapDegree = 7,
  isComplete = false,
}) => {
  const circumference = 2 * Math.PI * radius;
  const segmentAngle = 360 / steps;
  const visibleAngle = segmentAngle - gapDegree;
  const visibleLength = (visibleAngle / 360) * circumference;
  const gapLength = (gapDegree / 360) * circumference;
  const totalSegmentLength = visibleLength + gapLength;

  return (
    <svg
      width={radius * 2 + strokeWidth * 2}
      height={radius * 2 + strokeWidth * 2}
      viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}
    >
      <g
        transform={`rotate(-90 ${radius + strokeWidth}, ${radius + strokeWidth})`}
      >
        {Array.from({ length: steps }).map((_, i) => {
          const strokeDasharray = `${visibleLength} ${circumference}`;
          const strokeDashoffset = -i * totalSegmentLength;
          const isFilled = i < currentStep;

          return (
            <circle
              key={i}
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              fill="none"
              stroke={
                isFilled ? (isComplete ? "#006A60" : filledColor) : emptyColor
              }
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </g>
    </svg>
  );
};
