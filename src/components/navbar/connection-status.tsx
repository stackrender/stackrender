import { usePowerSync } from "@powersync/react";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { cn, Divider, Progress } from "@heroui/react";
import { differenceInHours, differenceInMinutes } from "date-fns";

const ConnectionStatus: React.FC = () => {

    const powerSync = usePowerSync();
    const [syncStatus, setSyncStatus] = useState(powerSync.currentStatus);
    const [downloadProgress, setDownloadProgress] = useState<number | undefined>(undefined);
    const clearProgressHandler: any = useRef(undefined);
    const [lastUploadAt, setLastUploadAt] = useState<Date | undefined>(() => {
        const last_upload_at = localStorage.getItem("last_upload_at");
        if (last_upload_at)
            return new Date(last_upload_at);
        return undefined;
    })

    useEffect(() => {
        const getLastUploadAtValue = () => {
            const last_upload_at = localStorage.getItem("last_upload_at");
            if (last_upload_at)
                setLastUploadAt(new Date(last_upload_at));

        }
        window.addEventListener("storage", getLastUploadAtValue);
        return () => {
            window.removeEventListener('storage', getLastUploadAtValue);
        }
    }, [])
    useEffect(() => {

        const l = powerSync.registerListener({
            statusChanged: (status) => {
                setSyncStatus(status);
            },
        });
        return () => l?.();
    }, [powerSync]);

    useEffect(() => {
        if (syncStatus.downloadProgress?.downloadedOperations && syncStatus.downloadProgress?.totalOperations) {
            const progress: number = Math.round(syncStatus.downloadProgress.downloadedOperations / syncStatus.downloadProgress.totalOperations * 100);
            if (progress <= 100) {
                setDownloadProgress(progress);

            }
            if (downloadProgress == 100 && !clearProgressHandler.current) {

                clearProgressHandler.current = setTimeout(() => {
                    setDownloadProgress(undefined);
                    clearProgressHandler.current = undefined;
                }, 700)
            }
        }
    }, [syncStatus.downloadProgress])

    const deltaUploadTime = useMemo(() => {

        if (lastUploadAt) {
            const currentDate = new Date();
            const minutes = differenceInMinutes(currentDate, lastUploadAt)
            const hours = differenceInHours(currentDate, lastUploadAt);

            if (hours > 0 && hours < 24) {
                return `${hours} hour ago`
            }
            if (minutes > 0 && minutes < 60)
                return `${minutes} min ago`

            if (hours > 24) {
                return `${lastUploadAt.toLocaleDateString()}`
            }
        }
        return "Just now";

    }, [lastUploadAt]);


    return (
        <div className="flex items-center ">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="border-1  flex gap-2 p-2 px-3 rounded-lg text-xs relative overflow-hidden  dark:border-default   ">
                        <span className={cn("flex gap-2 font-semibold", syncStatus.connected ? "text-success-400" : "text-danger-400")}>
                            {
                                syncStatus.connected ?
                                    <Wifi className="size-4 " /> :
                                    <WifiOff className="size-4 " />

                            }
                            {
                                syncStatus.connected ? "Online" : "Offline"
                            }

                        </span>
                        <Divider orientation="vertical" className="h-4" />


                        {
                            downloadProgress !== undefined ?
                                <>
                                    <span className="text-slate-500 dark:text-white w-[96px]  truncate">
                                        Saving ...
                                    </span>

                                    <Progress
                                        classNames={{
                                            base: "max-w-md absolute bottom-[-2px] left-0 w-full ",
                                            track: " bg-transparent",
                                            indicator: "bg-gradient-to-r from-secondary-200 to-primary ",
                                        }}
                                        radius="sm"
                                        aria-label="upload progress"
                                        showValueLabel={false}
                                        size="sm"
                                        value={downloadProgress}
                                    />

                                </>
                                :
                                <span className="text-slate-500 dark:text-white w-[96px] truncate font-semibold" >
                                    Saved {deltaUploadTime}
                                </span>

                        }
                    </div>

                </TooltipTrigger>
                <TooltipContent className="dark:bg-default-900">
                    Last synced {syncStatus.lastSyncedAt?.toISOString()}
                </TooltipContent>
            </Tooltip>
        </div>
    )
}



export default ConnectionStatus; 