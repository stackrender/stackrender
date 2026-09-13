import { TableType } from "@/lib/schemas/table-schema";
import { isTablesOverlapping } from "@/utils/tables";
import { areArraysEqual } from "@/utils/utils";
import {  useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Return type of the hook
type UseOverlapingType = {
    isOverlapping: boolean, // Indicates if any tables are overlapping
    puls: () => void        // Triggers a short visual pulse effect for overlapping tables
}

/**
 * Custom hook to detect overlapping tables in a React Flow diagram,
 * annotate them with metadata (`overlapping`, `pulsing`),
 * and provide a pulse trigger for visual feedback.
 */
const useOverlappingTables = (tables: TableType[]): UseOverlapingType => {
    const [isPulsing, setIsPulsing] = useState<boolean>(false);
    const { setNodes } = useReactFlow();
    const [overlappingTablesIds, setOverlappingTablesIds] = useState<Set<string>>(new Set<string>());
    /**
     * Triggers a brief "pulse" effect (e.g. for animations or styles)
     * by toggling a boolean flag for a short time.
     */
    const puls = useCallback(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 200);
    }, []);

    /**
     * Compute which tables are currently overlapping.
     * This is memoized to avoid recalculating unless tables change.
     */
    useEffect(() => {
        const overlaps: Set<string> = new Set();
        // Compare every pair of tables
        for (let i = 0; i < tables.length; i++) {
            for (let j = i + 1; j < tables.length; j++) {
                if (isTablesOverlapping(tables[i], tables[j])) {
                    overlaps.add(tables[i].id);
                    overlaps.add(tables[j].id);
                }
            }
        }

        if (!areArraysEqual(Array.from(overlaps), Array.from(overlappingTablesIds))) {
            setOverlappingTablesIds(overlaps);
        }
    }, [tables]);


    /**
     * When overlapping tables change, update each node’s `data.overlapping` property accordingly.
     * Avoids unnecessary updates using deep comparison.
     */
    useEffect(() => {
        const overlappingIds: string[] = Array.from(overlappingTablesIds);


        setNodes((nodes: any) => {
            return nodes.map((node: any) => {
                const isOverlaped: boolean = overlappingIds.includes(node.id);
                if (isOverlaped === node.data.overlapping)
                    return node; // No change needed
                else
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            overlapping: isOverlaped
                        }
                    };
            });
        });

    }, [overlappingTablesIds]);

    /**
     * When `isPulsing` is active, apply a `pulsing` property to overlapping tables
     * to trigger animations or visual indicators in the UI.
     */
    useEffect(() => {
        setNodes((nodes: any) => {
            return nodes.map((node: any) => {
                if (!node.data.overlapping)
                    return node;

                return {
                    ...node,
                    data: {
                        ...node.data,
                        pulsing: isPulsing
                    }
                };
            });
        });
    }, [isPulsing]);

    // True if any overlapping tables exist
    const isOverlapping: boolean = overlappingTablesIds.size > 0;

    // Return memoized object to avoid unnecessary rerenders
    return useMemo(() => ({
        puls,
        isOverlapping
    }), [isOverlapping, puls]);
};

export default useOverlappingTables;
