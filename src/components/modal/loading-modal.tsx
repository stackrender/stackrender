import { Spinner } from "@heroui/react";




interface LoadingProps {
    text?: string;
}


export const Loading: React.FC<LoadingProps> = ({ text }) => {

    return (
        <div className="fixed bg-overlay/50 backdrop-opacity-disabled w-screen h-screen fixed  flex items-center justify-center z-[99] left-0 top-0 text-white flex-col gap-2">
            <Spinner size="lg" />
            <span className="font-medium">
                Loading ...
            </span>
        </div>
    )
}

