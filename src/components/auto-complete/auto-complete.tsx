
import { Autocomplete as HeroUiAutocomplete, AutocompleteItem } from "@heroui/react";
import { Key } from "react";

interface AutocompleteProps {

    items: any[]
    label?: string,
    defaultSelection: string | undefined
    onSelectionChange?: (item: any) => void,
    placeholder?: string
}



const Autocomplete: React.FC<AutocompleteProps> = ({ items, label = "name", onSelectionChange, defaultSelection, placeholder }) => {



    const onItemChange = (item: Key | null) => {
        onSelectionChange && onSelectionChange(item);
    }

    return (
        <HeroUiAutocomplete
            className="w-full"
            defaultItems={items}
            size="sm"
            onSelectionChange={onItemChange}
            defaultSelectedKey={defaultSelection as any}
            variant="bordered"
            aria-label={placeholder}
            placeholder={placeholder}
        >
            {(item: any) => <AutocompleteItem key={item.id}>{item[label]}</AutocompleteItem>}
        </HeroUiAutocomplete>
    )
}

export default Autocomplete ; 