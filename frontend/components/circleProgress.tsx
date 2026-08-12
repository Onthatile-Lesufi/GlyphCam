import React from "react";
import { View } from "react-native";
import Svg, {Circle}  from "react-native-svg";

type CircleProps = {
    size: number;
    strokeWidth: number;
    colour: string;
    progress: number;
}

export const CircleProgress = ({ size, strokeWidth, colour, progress } : CircleProps) => {

  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
    return (
        <Svg width={size} height={size}>
            {/* Background Circle */}
            <Circle
                stroke={colour}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
            />
            {/* Progress Circle */}
            <Circle
                stroke={"white"}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeDasharray={`${circum} ${circum}`}
                strokeDashoffset={radius * Math.PI * 2 * (progress / 100)}
                strokeLinecap="butt"
                transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                strokeWidth={strokeWidth}
            />
        </Svg>
    )
}