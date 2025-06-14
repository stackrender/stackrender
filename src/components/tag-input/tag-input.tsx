

import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { WithContext as ReactTagInput, Tag } from 'react-tag-input';


interface TagInputProps {
    defaultItems?: string[];
    onItemsChange? : (items: string[]) => void
}


const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];


const TagInput: React.FC<TagInputProps> = ({ defaultItems = [], onItemsChange }) => {
    const { t } = useTranslation();
    const [tags, setTags] = useState<Tag[]>(defaultItems.map((item: string) => ({
        id: item.toLowerCase(),
        text: item,
        className: ""
    }) as Tag));

    const handleDelete = (i: number) => {
        setTags(tags.filter((_, index) => index !== i));
    };

    const handleAddition = (tag: Tag) => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
        const newTags = tags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        setTags(newTags);
    };
    useEffect(() => onItemsChange && onItemsChange(tags.map((tag: Tag) => tag.text)), [tags])

    return (
        <div>
            <ReactTagInput
                tags={tags}
                classNames={{
                    tag: "font-normal inline-block m-0.5   border-1 border-default  rounded-full px-2  py-1 flex-row ",
                    remove: " bg-default-900 rounded-full  text-xs text-center ml-1 min-w-[15px] max-w-[15px] min-h-[15px] max-h-[15px] transition-colors duration-300 hover:bg-black",
                    tagInputField: "relative w-full inline-flex flex-row items-center  bg-default-100 border-1 border-divider hover:border-primary focus-within:border-default-400 h-8 min-h-8 px-2 rounded-small transition-background !duration-150 transition-colors outline-none dark:bg-default placeholder:text-foreground-500 mt-2" , 
                    tags : "max-h-[256px] overflow-auto "
                }}
                handleDelete={handleDelete}
                autoFocus={false}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
                placeholder={t("db_controller.field_settings.type_enter")}
            />
        </div>
    );
}


export default React.memo(TagInput)