import { DatabaseType } from "@/lib/database"
import { Checkbox, Image } from "@heroui/react";




interface DatabaseCheckboxProps {
    database: DatabaseType,
}

const DatabaseCheckbox: React.FC<DatabaseCheckboxProps> = ({ database }) => {

    return (
        <Checkbox
            aria-label={database.name}
            value={database.dialect}
            className="database-checkbox"
            classNames={{
                base: "flex min-w-[128px] min-h-[128px]  max-w-[128px] max-h-[128px]  hover:bg-default rounded-md relative",
                wrapper: "absolute top-2 left-2 before:border-divider group-data-[hover=true]:before:bg-default" , 
                label : "flex items-center justify-center  w-full h-full p-2 "
            }}

            
        >
            <div className="min-w-full h-full flex items-center justify-center  ">
                <Image
                    src={database.logo}
                    className="w-full"
                />
            </div>
        </Checkbox>
    )
}


export default DatabaseCheckbox; 
