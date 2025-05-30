import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/tooltip/tooltip";
import { useDatabaseHistory } from "@/providers/database-history/database-history-provider";
import { Button, cn, Divider, Navbar } from "@heroui/react";
import { useOnViewportChange, useReactFlow } from "@xyflow/react";

import { LayoutGrid, Redo, Scan, Undo, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";



interface DbControlButtons {
    adjustPositions: () => void,
}

const ZOOM_DURATION = 100

const DatabaseControlButtons: React.FC<DbControlButtons> = ({ adjustPositions }) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const [zoom, setZoom] = useState<string>();
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
        <Navbar className="flex  rounded-md border-1 border-default-200 bg-background dark:bg-transparent bg-default dark:border-divider " isBlurred
            classNames={{
                wrapper: "h-14 p-2 gap-1",
            }}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="md"
                            isIconOnly
                            variant="light"
                            onPressEnd={undo}
                            radius="sm"
                            disabled={!canUndo}

                        >
                            <Undo className={cn(
                                "size-4 dark:text-white",
                                !canUndo ? "text-font/30" : ""
                            )} />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.undo")}
                    <span className="ml-2 text-default-400">
                        Cntl + Z
                    </span>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="md"
                            isIconOnly
                            variant="light"
                            radius="sm"
                            onPressEnd={adjustPositions}>
                            <LayoutGrid className="size-4 dark:text-white" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.adjust_positions")}
                </TooltipContent>
            </Tooltip>

            <Divider orientation="vertical" className="bg-font/10" />

            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="md"
                            isIconOnly
                            variant="light"
                            radius="sm"
                            onPressEnd={onZoomOut}>
                            <ZoomOut className="size-4 dark:text-white" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.zoom_out")}
                </TooltipContent>
            </Tooltip>

            <Button
                size="md"
                isIconOnly
                variant="light"
                onPressEnd={resetZoom}
                className="w-[60px] p-2 hover:bg-primary-foreground dark:text-white"
            >
                {zoom}
            </Button>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="md"
                            isIconOnly
                            variant="light"
                            radius="sm"
                            onPressEnd={onZoomIn}>
                            <ZoomIn className="size-4 dark:text-white" />
                        </Button>
                    </span>
                </TooltipTrigger>

                <TooltipContent>
                    {t("control_buttons.zoom_in")}
                </TooltipContent>
            </Tooltip>
            <Divider orientation="vertical" className="bg-font/10" />
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="md"
                            isIconOnly
                            variant="light"
                            radius="sm"
                            onPressEnd={onFitView}
                        >
                            <Scan className="size-4 dark:text-white" />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.show_all")}

                    <span className="ml-2 text-default-400">
                        Cntl + A
                    </span>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            size="md"
                            isIconOnly
                            variant="light"
                            radius="sm"
                            onPressEnd={redo}
                            disabled={!canRedo}
                        >
                            <Redo className={cn(
                                "size-4 dark:text-white",
                                !canRedo ? "text-font/30" : ""
                            )} />
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    {t("control_buttons.redo")}

                    <span className="ml-2 text-default-400">
                        Ctnl + Shift + Z
                    </span>
                </TooltipContent>
            </Tooltip>
        </Navbar>
    )
}


export default DatabaseControlButtons; 