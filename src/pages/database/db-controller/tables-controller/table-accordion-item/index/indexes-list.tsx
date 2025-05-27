import { Button,  } from "@heroui/react";
import IndexItem from "./index-item";
import { Plus } from "lucide-react"; 
import { useTranslation } from "react-i18next";

interface Props {

}



const IndexesList: React.FC<Props> = ({ }) => {
    const { t} = useTranslation() ; 
    return (
        <div className="w-full flex-col space-y-2">
            <div>
                <IndexItem />
            </div>
            <Button
                variant="flat"
                radius="sm"
                startContent={
                    <Plus className="size-4 text-icon" />
                }
                className="h-8 p-2 text-xs bg-transparent hover:bg-default text-gray font-semibold"
            //onClick={handleCreateTable}
            >
                {t("db_controller.add_index")}
            </Button>

        </div>
    )
}


export default IndexesList; 