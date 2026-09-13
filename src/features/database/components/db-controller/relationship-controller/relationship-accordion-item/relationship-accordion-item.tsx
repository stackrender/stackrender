
import {
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion" 
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import RelationshipAccordionTrigger from "./relationship-accordion-trigger";
import RelationshipAccordionContent from "./relationship-accordion-content";
import { DatabaseDialect } from "@/lib/database";

interface RelationshipAccordionItemProps {
    relationship: RelationshipType , 
        dialect? : DatabaseDialect

}


const RelationshipAccordionItem: React.FC<RelationshipAccordionItemProps> = ({ relationship , dialect }) => {

    return (
        <AccordionItem value={relationship.id} className="border-none" id={relationship.id}>
            <RelationshipAccordionTrigger relationship={relationship} dialect = { dialect} />
            <AccordionContent className="flex flex-col gap-4 text-balance">
                <RelationshipAccordionContent
                    relationship={relationship}
                />
            </AccordionContent>
        </AccordionItem>
    )
}


export default RelationshipAccordionItem; 