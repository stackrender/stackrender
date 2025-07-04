import { Image } from "@heroui/react";
import { useTheme } from "next-themes";




interface EmptyListProps {
    title?: string;
    description?: string;

}



const EmptyList: React.FC<EmptyListProps> = ({ title, description }) => {



    return (
        <div className="flex flex-col items-center  gap-2  h-full  pt-[86px]">
            {
                <Image
                    width={82}
                    src={"/public/stackrender.png"}
              
                />
            }
            {
                title &&
                <h1 className="text-font/90 font-bold text-lg">
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