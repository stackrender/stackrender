
import {
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion" 
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import RelationshipAccordionTrigger from "./relationship-accordion-trigger";
import RelationshipAccordionContent from "./relationship-accordion-content";

interface RelationshipAccordionItemProps {
    relationship: RelationshipType
}


const RelationshipAccordionItem: React.FC<RelationshipAccordionItemProps> = ({ relationship }) => {

    return (
        <AccordionItem value={relationship.id} className="my-2" id={relationship.id}>
            <RelationshipAccordionTrigger relationship={relationship} />
            <AccordionContent className="flex flex-col gap-4 text-balance">
                <RelationshipAccordionContent
                    relationship={relationship}
                />
            </AccordionContent>
        </AccordionItem>
    )
}


export default RelationshipAccordionItem; 