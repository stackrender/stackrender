import { DataType } from "../data/data-types";

export interface Field {
    id: string;
    name: string;
    type: DataType;
    primaryKey: boolean;
    unique: boolean;
    nullable: boolean;
    createdAt: number;
    default?: string;
 
    
}