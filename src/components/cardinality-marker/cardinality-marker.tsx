import { CardinalityStyle } from "@/lib/database";
import { cn } from "@heroui/react";
import React from "react";

export interface CardinalityMarkerProps {

    selected?: boolean,
    direction?: "start" | "end",
    cardinality: "one" | "many",
    style?: CardinalityStyle
}



const CardinalityMarker: React.FC<CardinalityMarkerProps> = ({ selected = false, cardinality, direction = "start", style = CardinalityStyle.SYMBOLIC }) => {

    const id = `${cardinality}_${direction}${selected ? "_selected" : ""}`;
    const renderMarker = () => {

        if (cardinality == "many") {
            if (direction == "start")
                return (<path d="M 0 50 L 100 50 M 100 50 L 0 0 M 100 50 L 0 100 " />)
            else if (direction == "end")
                return (<path d="M 100 50 L 0 50 M 0 50 L 100 0 M 0 50 L 100 100" />)

        }

        if (cardinality == "one") {
            if (direction == "start") {
                return (<path d="M 0 50 L 100 50 M 50 50 M 50 50 M 75 25 L 75 75" />)
            }
            if (direction == "end") {
                return (<path d="M 100 50 L 0 50 M 50 50 M 50 50 M 25 25 L 25 75" />)
            }
        }


    }

    
    if (style == CardinalityStyle.SYMBOLIC)
        return (
            <>
                <marker
                    id={id}
                    markerWidth="24"
                    markerHeight="24"
                    refX="12"
                    refY="12"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >
                    <svg
                        fill="transparent"
                        className={selected ? "stroke-primary" : "stroke-default-600 dark:stroke-default-400"}
                        strokeWidth="4"
                        width="24"
                        height="24"
                        viewBox="0 0 100 100">
                        {
                            renderMarker()
                        }
                    </svg>
                </marker>
            </>
        )
    else if (style == CardinalityStyle.NUMERIC) {
        return (
            <marker
                id={id}
                viewBox="0 0 24 24"
                markerWidth="24"
                markerHeight="24"
                refX={direction == "start" ? "2" : "22"}
                refY="12"
                orient="auto"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="8"
                    strokeWidth="1"
                    className={
                        cn("dark:fill-default fill-default",
                            selected ? " stroke-primary fill-background dark:fill-primary-900" : " stroke-default-600 dark:stroke-default-400"
                        )
                    }
                />
                <text
                    x="12"
                    y="13"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8"
                    className={
                        cn("fill-font/90 dark:fill-font/90 font-semibold" , 
                            selected ? "fill-primary dark:fill-primary" : "" , 
                        )
                    }
                >
                    {cardinality == "one" ? "I" : "N"}
                </text>
            </marker>
        )
    }

}


export default React.memo( CardinalityMarker); 