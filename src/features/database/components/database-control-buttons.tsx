

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useDatabaseHistory } from "@/providers/database-history/database-history-provider";

import { useOnViewportChange, useReactFlow } from "@xyflow/react";

import { LayoutGrid, Redo, Scan, Undo, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback,   useState } from "react";
import { useTranslation } from "react-i18next";

interface DbControlButtons {
    adjustPositions: () => void,
}

const ZOOM_DURATION = 100

const DatabaseControlButtons: React.FC<DbControlButtons> = ({ adjustPositions }) => {
    const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();

    const [zoom, setZoom] = useState<string>(
        `${Math.round(getZoom() * 100)}%`
    );
    const { t } = useTranslation();
    const { undo, redo, canRedo, canUndo } = useDatabaseHistory();

    useOnViewportChange({
        onChange: ({ zoom }) => {
            setZoom(`${Math.round(zoom * 100)}%`);
        },
    });

    const onZoomIn = useCallback(() => {
        zoomIn({ duration: ZOOM_DURATION });
    }, [])

    const onZoomOut = useCallback(() => {
        zoomOut({ duration: ZOOM_DURATION });
    }, [])

    const onFitView = useCallback(() => {
        fitView({
            duration: 500,
            padding: 0.1,
            maxZoom: 0.9,
        })
    }, [])

    const resetZoom = useCallback(() => {
        fitView({
            duration: 500,
            minZoom: 1,
            maxZoom: 1,
        })
    }, []);

    return (
        <div className="flex !rounded-md p-2 border-1 !overflow-hidden !bg-background/20 dark:!bg-card/20 text-muted-foreground shadow-md backdrop-blur-sm"
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size={"icon"}
                            onClick={undo}
                            disabled={!canUndo}


                            variant={"ghost"}

                        >
                            <Undo className={cn(
                                "size-4"
                            )} />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.undo")}
                    <span className="ml-2">
                        Cntl + Z
                    </span>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size={"icon"}
                            onClick={adjustPositions}
                            variant={"ghost"}
                        >
                            <LayoutGrid className="size-4" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.adjust_positions")}
                </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" />

            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="icon"
                            onClick={onZoomOut}
                            variant={"ghost"}
                        >
                            <ZoomOut className="size-4" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.zoom_out")}
                </TooltipContent>
            </Tooltip>

            <Button
                size="icon"
                variant={"ghost"}
                onClick={resetZoom}
                className="w-[60px] p-2 "
            >
                {zoom}
            </Button>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="icon"
                            onClick={onZoomIn}
                            variant={"ghost"}
                        >
                            <ZoomIn className="size-4" />
                        </Button>
                    </span>
                </TooltipTrigger>

                <TooltipContent>
                    {t("control_buttons.zoom_in")}
                </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" />
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="icon"
                            onClick={onFitView}
                            variant={"ghost"}
                        >
                            <Scan className="size-4" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.show_all")}

                    <span className="ml-2">
                        Cntl + A
                    </span>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="icon"
                            variant={"ghost"}
                            onClick={redo}
                            disabled={!canRedo}
                        >
                            <Redo className={cn("size-4")} />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.redo")}
                    <span className="ml-2  ">
                        Ctnl + Shift + Z
                    </span>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}


export default DatabaseControlButtons;

