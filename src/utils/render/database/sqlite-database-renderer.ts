import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { AST } from "node-sql-parser";
import { fixSQLiteColumnOrder } from "../render-uttils";
import { format } from 'sql-formatter';
import { RelationshipType } from "@/lib/schemas/relationship-schema";
import { ASTStatment } from "./base-database-renderer";
import { BaseSQLRenderer } from "./base-sql-renderer";
import { FieldType } from "@/lib/schemas/field-schema";
import { TableType } from "@/lib/schemas/table-schema";
import { DBDiffOperation } from "@/utils/database";
import { RenderableTable, SortableTable, toRenderableTable, toSortableTable } from "@/lib/table";
import { DatabaseType } from "@/lib/schemas/database-schema";
import { orderTables } from "@/utils/tables";

export default class SqliteRenderer extends BaseSQLRenderer {

    public constructor(data_types: DataType[]) {
        super(DatabaseDialect.SQLITE, data_types)
    }

    protected async astToSQL(ast: AST[]): Promise<string> {
        try {
            let sql: string = await super.astToSQL(ast);

            sql = fixSQLiteColumnOrder(format(sql, { language: "sql" }));
            sql = format(sql, { language: 'sql' });

            if (sql.length > 0) {
                sql = `${this.startTransaction()}

${sql};

${this.commit()}
`
            }
            return sql;
        } catch (error) {
            throw error;
        }
    }

    protected operationsToAst(operations: DBDiffOperation[], database?: DatabaseType): ASTStatment[] {

        const ast: ASTStatment[] = [];

        let sortedTables: TableType[] | RenderableTable = operations.filter((operation: DBDiffOperation) => operation.type == "CREATE_TABLE").map((operation: DBDiffOperation) => (operation as any).table)

        if (database) {
            let renderableTables: RenderableTable[] = sortedTables.map((table: TableType) => toRenderableTable(table, database));
            let sortableTables: SortableTable[] = renderableTables.map((table: RenderableTable) => toSortableTable(table));

            const sortedTablesIds: string[] = orderTables(sortableTables);

            sortedTables = sortedTablesIds.map((id: string) =>
                renderableTables.find((table: TableType) => table.id == id) as TableType
            );
        }

        const relationshipOperations: DBDiffOperation[] = operations.filter((operation: DBDiffOperation) => operation.type == "CREATE_RELATIONSHIP");

        // we basiclly loop over all operations , and turn them into ast . 
        // some operation can return multiple statments . 
        // so for that we need to check our input if its one AST or an object AST 
        for (const table of sortedTables) {
            const statmentAst = this.createTableAst(table);

            if (!statmentAst)
                continue;


            if ((table as RenderableTable).foreignRelationships?.length > 0) {
                const relationshipsAst: ASTStatment[] = (table as RenderableTable).foreignRelationships.map((relationship: RelationshipType) => {
                    const operation: DBDiffOperation = relationshipOperations.find((operation: DBDiffOperation) => (operation as any).relationship?.id == relationship.id) as DBDiffOperation;
                    return this.createRelationshipAst((operation as any).relationship)
                })

                if (Array.isArray(statmentAst)) {

                    const index = statmentAst.findIndex((statment: any) => statment.type == "create" && statment.keyword == "table");

                    if (index >= 0) {
                        (statmentAst[index] as any).create_definitions.push(...relationshipsAst)
                    }
                }
            }
            if (Array.isArray(statmentAst))
                ast.push(...statmentAst);
            else
                ast.push(statmentAst);
        }
        return ast;
    }

    protected createRelationshipAst(relationship: RelationshipType): ASTStatment {
        const relationshipAst: any = super.createRelationshipAst(relationship) as any;
        return relationshipAst.expr[0].create_definitions;
    }

    protected getUsingAst(table: TableType, field: FieldType, dataType: DataType): AST | null {
        throw new Error("Method not implemented.");
    }
    protected dropPrimaryKeyConstraintExpr(table: TableType): ASTStatment {
        throw new Error("Method not implemented.");
    }
    protected createPrimaryKeyConstraintExpr(table: TableType, fields: FieldType[]): ASTStatment {
        throw new Error("Method not implemented.");
    }

}