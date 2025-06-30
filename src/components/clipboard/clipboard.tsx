import React, { useCallback, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip/tooltip";
import { useTranslation } from "react-i18next";
import { Button } from "@heroui/react";
import { Copy, CopyCheck } from "lucide-react";



interface ClipboardProps {
    text?: string
}

const Clipboard: React.FC<ClipboardProps> = ({ text }) => {
    const { t } = useTranslation();


    const [isCopied, setIsCopied] = useState<boolean>(false);

    const copyToClipboard = useCallback(async () => {
        if (text)
            try {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 500)

            } catch (err) {

                setIsCopied(false);
            }

    }, [text])

    return (
        <Tooltip>
            <TooltipTrigger>
                <span>
                    <Button
                        size="sm"
                        isIconOnly
                        variant="bordered"
                        className="text-font/90 border-divider"
                        onPressEnd={copyToClipboard}
                    >
                        {
                            !isCopied ? <Copy className="size-4" /> : <CopyCheck className="size-4" />

                        }
                    </Button>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                {!isCopied ? t("clipboard.copy") : t("clipboard.copied")}
            </TooltipContent>
        </Tooltip>
    )
};

export default React.memo(Clipboard)