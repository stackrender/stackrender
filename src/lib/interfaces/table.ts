import { Field } from "./field";

export interface Table {
    id: string;
    name: string;
    x: number;
    y: number;
    fields: Field[];
    width?: number;
    order?: number;    
    color: string;    
    createdAt: number;
    comments?: string;
}