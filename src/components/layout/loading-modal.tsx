import { Spinner } from "../ui/shadcn-io/spinner";




interface LoadingProps {
    text?: string;
}


export const Loading: React.FC<LoadingProps> = ({ text }) => {

    return (
        <div className="fixed bg-black/50 backdrop-opacity-disabled w-screen h-screen fixed  flex items-center justify-center z-[50] left-0 top-0 text-white flex-col gap-2">
            <Spinner size={48} variant="ellipsis" className="text-primary"  />
            <span className="font-medium">
                Loading ...
            </span>
        </div>
    )
}

