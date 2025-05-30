import { cn } from "@heroui/react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip"

interface ToggleProps {
    active?: boolean,
    children: React.ReactNode,
    onToggle?: (value: boolean) => void,
    className?: string , 
    label? : string
}


const ToggleButton: React.FC<ToggleProps> = ({ active = false, children, onToggle, className , label }) => {

    const toggle = () => {
        onToggle && onToggle(!active)
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button className={
                    cn("p-1 px-2 transition-all hover:bg-default hover:text-font/90 rounded duration-200 ",
                        className ? className : "",
                        active ?
                            "text-font/90 bg-default dark:text-font/90 white dark:bg-default/40" :
                            "text-icon"
                    )
                }

                    onClick={toggle}
                >
                    <span className="text-sm">
                        {children}
                    </span>
                </button>
            </TooltipTrigger>
            <TooltipContent>
                {label}
            </TooltipContent>
        </Tooltip>
    )
}


export default ToggleButton