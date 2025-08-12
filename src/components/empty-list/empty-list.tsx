import { Image } from "@heroui/react";
import { useTheme } from "next-themes";




interface EmptyListProps {
    title?: string;
    description?: string;

}



const EmptyList: React.FC<EmptyListProps> = ({ title, description }) => {



    return (
        <div className="flex flex-col items-center  gap-1  h-full  pt-[86px] main-linear-background rounded-lg">
            {
                <Image
                    width={64}
                    src={"/stackrender.png"}
              
                />
            }
            {
                title &&
                <h1 className="text-font/90 font-bold text-md mt-2">
                    {title}
                </h1>
            }
            {

                description &&
                <p className="text-sm text-font/70">
                    {description}
                </p>
            }
        </div>
    )
}


export default EmptyList; 