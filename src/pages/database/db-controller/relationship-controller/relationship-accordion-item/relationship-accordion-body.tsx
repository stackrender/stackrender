
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip/tooltip";
import { Button, Select, SelectItem } from "@heroui/react";
import { ChevronsLeftRightEllipsis, FileMinus2, FileOutput, SquareArrowLeft, SquareArrowRight, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";



interface Props {

}


export const cardinalities = [
    { key: "one2one", label: "One to One" },
    { key: "one2many", label: "One to Many" },
    { key: "many2one", label: "Many to One" },
    { key: "many2many", label: "Many 2 many" },

];



const RelationshipAccordionBody: React.FC<Props> = ({ }) => {

    const {t } =  useTranslation() ; 
    return (
        <div className="w-full p-2 space-y-4">
            <div className="flex">
                <div className="w-full space-y-1">
                    <label className="font-medium flex text-slate-700 flex items-center gap-1 text-sm">
                        <FileOutput className="size-4" />
                        {t("db_controller.primary_table")}
                    </label>
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="truncate text-left text-sm">
                                users(id)
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            users(id)
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="w-full space-y-1">
                    <label className="font-medium flex text-slate-700 flex items-center gap-1 text-sm">
                        <FileMinus2 className="size-4" />
                        {t("db_controller.referenced_table")}

                    </label>

                    <Tooltip>
                        <TooltipTrigger>
                            <span className="truncate text-left text-sm ">
                                products(user_id)
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            products(user_id)
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className="space-y-2">
                <label className="flex text-sm font-medium flex text-slate-700 items-center gap-1">
                    <ChevronsLeftRightEllipsis className="size-4 " />
                    {t('db_controller.cardinality.name')}
                </label>
                <Select
                    className="w-full"
                    size="sm"
                    variant="bordered"
                >
                        <SelectItem key={"one2one"}>{t("db_controller.cardinality.one_to_one")}</SelectItem>

                        <SelectItem key={"one2many"}>{t("db_controller.cardinality.one_to_many")}</SelectItem>

                        <SelectItem key={"many2one"}>{t("db_controller.cardinality.many_to_one")}</SelectItem>

                        <SelectItem key={"many2many"}>{t("db_controller.cardinality.many_to_many")}</SelectItem>

                   
                </Select>
            </div>
            <div className="flex justify-center">
                <Button
                    variant="solid"
                    className="bg-transparent text-xs"
                    radius="sm"
                    size="sm"
                >
                    <Trash2 className="mr-1 size-3.5 text-danger" />
                    <div className="text-danger font-semibold">
                        {t("db_controller.delete")}
                    </div>
                </Button>
            </div>
        </div>
    )
}


export default RelationshipAccordionBody; 