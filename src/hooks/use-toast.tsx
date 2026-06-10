
import { IconCircleCheck } from "@tabler/icons-react";
import { CircleAlert, OctagonX } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
export type ToastVariant = "INFO" | "ERROR" | "SUCCESS";

export interface ToastAction {
    title: string,
    actionHandler: () => void;
}

const useToast = () => {

    const raise = useCallback((title: string, description: React.ReactNode, variant: ToastVariant = "INFO", action?: ToastAction) => {

        toast(title, {
            description,
            ...toastStyles[variant],
            action: action ? {
                label: action.title,
                onClick: action.actionHandler,
            } : undefined,

        });
    }, []);

    return raise;
}



const toastStyles = {
    SUCCESS: {
        classNames: {
            description: "!text-chart-2"
        },

        style: {
            '--normal-bg':
                'color-mix(in oklab, light-dark(var(--color-chart-2), var(--color-chart-2)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-chart-2), var(--color-chart-2))',
            '--normal-border': 'light-dark(var(--color-chart-2), var(--color-chart-2))'
        } as React.CSSProperties,
        icon: <IconCircleCheck className="size-5" />
    },
    INFO: {
        classNames: {
            description: "!text-primary"
        },

        style: {
            '--normal-bg':
                'color-mix(in oklab, light-dark(var(--color-primary), var(--primary)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-primary), var(--primary))',
            '--normal-border': 'light-dark(var(--color-primary), var(--primary))'
        } as React.CSSProperties,
        icon: <CircleAlert className="size-4" />

    },
    ERROR: {
        classNames: {
            description: "!text-destructive"
        },
        style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
        } as React.CSSProperties , 
        icon :  <OctagonX className="size-4" />
    }
}


export default useToast; 