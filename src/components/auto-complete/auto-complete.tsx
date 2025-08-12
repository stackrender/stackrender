
import { Autocomplete as HeroUiAutocomplete, AutocompleteItem, AutocompleteSection } from "@heroui/react";
import { Key, useState } from "react";

interface AutocompleteProps {

    items?: any[]
    label?: string,
    defaultSelection?: string | undefined
    onSelectionChange?: (item: any) => void,
    placeholder?: string
    isDisabled?: boolean
    selectedItem?: Key,
    grouped?: boolean
}


const headingClasses =
    "flex w-full py-1.5 px-2 bg-default  shadow-md border-1 font-medium  rounded-md dark:border-font/5 dark:bg-background-100";


const Autocomplete: React.FC<AutocompleteProps> = ({ items, label = "name", onSelectionChange, defaultSelection, placeholder, isDisabled, selectedItem, grouped = false }) => {

    

    const onItemChange = (item: Key | null) => {
        onSelectionChange && onSelectionChange(item);
    }
    if (!grouped)
        return (
            <HeroUiAutocomplete
                radius="sm"
                isDisabled={isDisabled}

                defaultItems={items || []}
                size="sm"
                onSelectionChange={onItemChange}
                defaultSelectedKey={defaultSelection as any}
                variant="bordered"
                aria-label={placeholder}
                placeholder={placeholder}
                selectedKey={selectedItem as any}
                className="h-8 w-full focus-visible:ring-0 shadow-none "
                classNames={{
                    clearButton: "text-icon",
                    selectorButton: "text-icon",
                    popoverContent: "rounded-md "
                }}
                inputProps={{
                    classNames: {
                        inputWrapper: " border-divider group-hover:border-primary group-data-[focus=true]:border-primary",
                    },
                }}

            >
                {(item: any) => <AutocompleteItem key={item.id}>{item[label]}</AutocompleteItem>}
            </HeroUiAutocomplete>
        )
    if (grouped) {
        return <HeroUiAutocomplete
            radius="sm"
            isDisabled={isDisabled}
            size="sm"
            onSelectionChange={onItemChange}
            defaultSelectedKey={defaultSelection as any}
            variant="bordered"
            aria-label={placeholder}
            placeholder={placeholder}
            className="h-8 w-full focus-visible:ring-0 shadow-none "
            selectedKey={selectedItem as any}
            classNames={{
                clearButton: "text-icon",
                selectorButton: "text-icon",
                popoverContent: "rounded-md "
            }}
            inputProps={{
                classNames: {
                    inputWrapper: "border-divider group-hover:border-primary group-data-[focus=true]:border-primary",
                },
            }}

        >
            {
                items ? Object.keys(items).map((key: string) => (
                    <AutocompleteSection
                        key={key.toUpperCase()}
                        classNames={{
                            heading: headingClasses,
                        }}
                        title={key.toUpperCase()}
                    >
                        {
                            items[key as any].map((item: any) => (
                                <AutocompleteItem key={item.id}>{item[label]}</AutocompleteItem>
                            ))
                        }
                    </AutocompleteSection>

                )) : []
            }


        </HeroUiAutocomplete>
    }
}

export default Autocomplete; 