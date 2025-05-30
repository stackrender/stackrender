export interface CardinalityMarkerProps {

    selected?: boolean,
    direction?: "start" | "end",
    type: "one" | "many"
}



const CardinalityMarker: React.FC<CardinalityMarkerProps> = ({ selected = false, type, direction = "start" }) => {

    const id = `${type}_${direction}${selected ? "_selected" : ""}`;
    const renderMarker = () => {
        if (type == "many") {
            if (direction == "start")
                return (<path d="M 0 50 L 100 50 M 100 50 L 0 0 M 100 50 L 0 100 " />)
            else if (direction == "end")
                return (<path d="M 100 50 L 0 50 M 0 50 L 100 0 M 0 50 L 100 100" />)

        }

        if (type == "one") {
            if (direction == "start") {
                return (<path d="M 0 50 L 100 50 M 50 50 M 50 50 M 75 25 L 75 75" />)
            }
            if (direction == "end") {
                return (<path d="M 100 50 L 0 50 M 50 50 M 50 50 M 25 25 L 25 75" />)
            }
        }
    }
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

}


export default CardinalityMarker; 