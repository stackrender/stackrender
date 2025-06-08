
import { Autocomplete as HeroUiAutocomplete, AutocompleteItem, AutocompleteSection } from "@heroui/react";
import { Key } from "react";

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
   "flex w-full py-1.5 px-2 bg-default  shadow-small rounded-small";


const Autocomplete: React.FC<AutocompleteProps> = ({ items, label = "name", onSelectionChange, defaultSelection, placeholder, isDisabled, selectedItem, grouped = false }) => {

    
    const onItemChange = (item: Key | null) => {
        onSelectionChange && onSelectionChange(item);
    }
    if (!grouped)
        return (
            <HeroUiAutocomplete
                radius="sm"
                isDisabled={isDisabled}
                className="w-full"
                defaultItems={items || []}
                size="sm"
                onSelectionChange={onItemChange}
                defaultSelectedKey={defaultSelection as any}
                variant="bordered"
                aria-label={placeholder}
                placeholder={placeholder}
                selectedKey={selectedItem as any}
                inputProps={{
                    classNames: {
                        
                        inputWrapper: "border-divider group-hover:border-primary",

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
            className="w-full"

            size="sm"
            onSelectionChange={onItemChange}
            defaultSelectedKey={defaultSelection as any}
            variant="bordered"
            aria-label={placeholder}
            placeholder={placeholder}
            
            selectedKey={selectedItem as any}
            inputProps={{
                classNames: {

                    inputWrapper: "border-divider group-hover:border-primary",

                },
            }}

        >
            {
                items ? Object.keys(items).map((key: any) => (
                    <AutocompleteSection
                        classNames={{ 
                            heading: headingClasses,
                        }}
                        title={key}
                    >
                        {
                            items[key].map((item: any) => (
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