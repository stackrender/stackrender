import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { BaseSqlImporter, ExtractedStatments, ParsedDatabaase, ParsedField } from "./base-sql-importer";

import { DataTypes, Modifiers, TimeDefaultValues } from "@/lib/field";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { FieldInsertType } from "@/lib/schemas/field-schema";

export class OracleImporter extends BaseSqlImporter {

    private alterNullabilityStatments: string[] = [];

    public constructor(data_types: DataType[]) {
        super(data_types);
        this.dialect = DatabaseDialect.ORACLE;
    }



    public parseSql(sql: string) {
        try {
            this.alterNullabilityStatments = [];
            const parsedDatabaase: ParsedDatabaase = super.parseSql(sql);
            for (const statment of this.alterNullabilityStatments) {
                try {

                    this.processAlterColumnNullabilityStatment(statment, parsedDatabaase.tables);
                } catch (error) {
                    parsedDatabaase.errors.push(error as Error);
                }
            }
            return parsedDatabaase;
        } catch (error) {
            throw error;
        }
    }


    protected astToField(ast: any, sequence: number): ParsedField {
        const { field, fk_constraint } = super.astToField(ast, sequence);

        const dataType: DataType = this.data_types.find((dataType: DataType) => dataType.id == field.typeId) as DataType;
        // get the modifiers to test if the data type really support auto increment or not 
        const modifiers: string[] = dataType?.modifiers ? JSON.parse(dataType.modifiers) : [];

        if (ast.data_type.Custom && Array.isArray(ast.data_type.Custom)) {
            if (ast.data_type.Custom.length == 2 && ast.data_type.Custom[1]?.length == 2 && !isNaN(Number(ast.data_type.Custom[1]?.[1] && modifiers.includes(Modifiers.SCALE))))
                field.scale = Number(ast.data_type.Custom[1]?.[1]);
        }
        // get field defintion options
        const options: any | undefined = [] = ast.options;
        for (const option of options) {
            if (option.option?.Generated?.generated_as == "ByDefault") {
                if (modifiers.includes(Modifiers.AUTO_INCREMENT)) {
                    field.autoIncrement = true;
                    break;
                }
            }
        }
        return { field, fk_constraint };

    }


    private processAlterColumnNullabilityStatment(statement: string, tables: TableInsertType[]): void {


        const regex = /ALTER\s+TABLE\s+"(?<tableName>[^"]+)"\s+MODIFY\s*\(\s*"(?<columnName>[^"]+)"\s+(?<nullability>NOT\s+NULL|NULL)(?:\s+ENABLE)?\s*\)/i;
        const match = statement.match(regex);



        if (match?.groups) {
            const { tableName, columnName, nullability } = match.groups;


            const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name.toUpperCase() == tableName.toUpperCase());
            if (!table) {
                throw Error("Altered Table not found in : " + statement);
            }
            const field : FieldInsertType | undefined = table.fields?.find((field: FieldInsertType) => field.name.toUpperCase() == columnName.toUpperCase())  
            if (!field)
                throw Error("Altered field not found in : " + statement);
 
            
            field.nullable = !(nullability.toUpperCase() == "NOT NULL") ; 
    
        }
    }

    protected processDefaultValue(ast: any, dataType: DataType): string | undefined {
        const defaultValue: string | undefined = super.processDefaultValue(ast, dataType);

        if (!defaultValue && ast.Identifier && ast.Identifier.value && dataType.type == DataTypes.TIME) {

            if (this.isCurrentTimesTampFunction(ast.Identifier.value))
                return TimeDefaultValues.NOW;
        }
        return defaultValue;
    }


    protected isCurrentTimesTampFunction(value: string): boolean {
        const upper: string = value.toUpperCase();
        return super.isCurrentTimesTampFunction(value) || upper == "SYSDATE" || upper == "SYSTIMESTAMP";
    }

    protected processDataType(typeName: string): DataType | undefined {
        let dataType: DataType | undefined = super.processDataType(typeName);

        if (!dataType) {
            if (typeName == "year") {
                return this.data_types.find((dataType: DataType) => dataType.name == "interval year to month");
            }
            else if (typeName == "day") {
                return this.data_types.find((dataType: DataType) => dataType.name == "interval day to second");
            }
        }
        return dataType;
    }


    protected cleanSql(sql: string): string {
        let cleaned: string = super.cleanSql(sql);
        cleaned = cleaned.replace(/\bWITH\s+LOCAL\s+TIME\b/gi, 'WITH TIME');
        // remove all ENABLE keywords in add foriegn key constraint
        cleaned = cleaned.replace(
            /(ALTER\s+TABLE[\s\S]*?FOREIGN\s+KEY[\s\S]*?REFERENCES[\s\S]*?)\s+ENABLE(?=\s*;)/gi,
            '$1'
        );
        // remove MINVALUE [X] MAXVALUE [Y] INCREMENT BY [N] START WITH [M] CACHE [C] NOORDER NOCYCLE NOKEEP NOSCALE .
        cleaned = cleaned.replace(
            /(GENERATED\s+(?:ALWAYS|BY\s+DEFAULT(?:\s+ON\s+NULL)?)\s+AS\s+IDENTITY)([\s\S]*?)(?=,|\s+NOT\s+NULL|\s+PRIMARY\s+KEY)/gi,
            '$1'
        );
        // remove all USING INDEX ENBALE in add Unique or Primary Key constraints . 
        cleaned = cleaned.replace(/\s+USING\s+INDEX\s+ENABLE(?=\s*;)/gi, '');
        // remove START WITH X INCREMENT BY Y
        cleaned = cleaned.replace(/\s+START\s+WITH\s+\d+(?:\s+INCREMENT\s+BY\s+\d+)?/gi, '');
        cleaned = cleaned.replace(
            /\bINTERVAL\s+YEAR(\s*\(\s*\d+\s*\))?\s+TO\s+MONTH(?:\s*\(\s*\d+\s*\))?/gi,
            'YEAR$1'
        );

        cleaned = cleaned.replace(
            /\bINTERVAL\s+DAY(\s*\(\s*\d+\s*\))?\s+TO\s+SECOND(?:\s*\(\s*\d+\s*\))?/gi,
            'DAY$1'
        );
 

        return cleaned;
    }

    protected extractStatments(sql: string): ExtractedStatments {

        const statments: ExtractedStatments = super.extractStatments(sql);

        statments.alterTableStatements = statments.alterTableStatements.filter((statment: string) => {
            if (/ALTER\s+TABLE\s+.+?\s+MODIFY\s*\(\s*".+?"\s+(?:NULL|NOT\s+NULL)(?:\s+ENABLE)?\s*\)/i.test(statment)) {

                this.alterNullabilityStatments.push(statment);

            }
            else {

                return statment;
            }
        })
        return statments
    }
}


/*






-- =============================================
-- Creative Enterprise Platform Database for Oracle
-- Theme: Multi-Tenant Project Management & Resource Planning
-- Version: 3.0 (Oracle Edition)
-- =============================================

-- Drop user/schema if needed (optional - run separately)
-- DROP USER creative_enterprise CASCADE;
-- CREATE USER creative_enterprise IDENTIFIED BY password;
-- GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO creative_enterprise;
-- CONNECT creative_enterprise/password;

-- =============================================
-- 1. TENANT & ORGANIZATION SCHEMA
-- =============================================

-- Inline primary key, inline unique, default as expression
CREATE TABLE Tenants (
    TenantID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 100 INCREMENT BY 1 PRIMARY KEY,
    TenantCode VARCHAR2(20) NOT NULL UNIQUE,
    TenantName NVARCHAR2(200) NOT NULL,
    SubscriptionTier VARCHAR2(30) DEFAULT 'Trial' NOT NULL,
    CreatedDate DATE DEFAULT SYSDATE NOT NULL,
    IsActive CHAR(1) DEFAULT '1' NOT NULL,
    MaxUsers NUMBER(5) DEFAULT 10 NOT NULL,
    CONSTRAINT UQ_Tenant_Name UNIQUE (TenantName)
);

-- Constraints at end of table
CREATE TABLE Departments (
    DepartmentID NUMBER(10) NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    DeptCode VARCHAR2(20) NOT NULL,
    DeptName NVARCHAR2(100) NOT NULL,
    Budget NUMBER(18,2) DEFAULT 0 NOT NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_Departments PRIMARY KEY (DepartmentID, TenantID),
    CONSTRAINT UQ_DeptCode_Tenant UNIQUE (DeptCode, TenantID)
);

-- Foreign key added via ALTER after creation
CREATE TABLE Companies (
    CompanyID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 500 INCREMENT BY 5 NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    CompanyName NVARCHAR2(150) NOT NULL,
    LegalName NVARCHAR2(200) NOT NULL,
    TaxNumber VARCHAR2(50) NOT NULL,
    FoundedYear NUMBER(4) DEFAULT EXTRACT(YEAR FROM SYSDATE) NOT NULL,
    IsHeadquarters CHAR(1) DEFAULT '0' NOT NULL
);

-- Adding constraint via ALTER
ALTER TABLE Companies ADD CONSTRAINT PK_Companies PRIMARY KEY (CompanyID);
ALTER TABLE Companies ADD CONSTRAINT UQ_Company_TaxNumber UNIQUE (TaxNumber);
ALTER TABLE Companies ADD CONSTRAINT UQ_Company_Name_Tenant UNIQUE (CompanyName, TenantID);

-- =============================================
-- 2. USER & ROLE MANAGEMENT
-- =============================================

-- Mix of inline and named constraints
CREATE TABLE Roles (
    RoleID RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    RoleName VARCHAR2(50) NOT NULL CONSTRAINT AK_RoleName UNIQUE,
    PriorityLevel NUMBER(3) DEFAULT 5 NOT NULL,
    IsSystemRole CHAR(1) DEFAULT '0' NOT NULL
);

-- Primary key inline, foreign keys at end
CREATE TABLE Users (
    UserID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    RoleID RAW(16) NOT NULL,
    Email VARCHAR2(255) NOT NULL,
    Username VARCHAR2(100) NOT NULL,
    PasswordHash CHAR(64) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    LastLogin TIMESTAMP NULL,
    IsLocked CHAR(1) DEFAULT '0' NOT NULL,
    LoginAttempts NUMBER(3) DEFAULT 0 NOT NULL,
    CONSTRAINT PK_Users PRIMARY KEY (UserID),
    CONSTRAINT UQ_User_Email UNIQUE (Email),
    CONSTRAINT UQ_User_Username_Tenant UNIQUE (Username, TenantID)
);

-- Foreign keys added via ALTER
ALTER TABLE Users ADD CONSTRAINT FK_Users_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(TenantID);
ALTER TABLE Users ADD CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleID) REFERENCES Roles(RoleID);

-- Foreign key added via ALTER
CREATE TABLE UserProfiles (
    ProfileID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    UserID NUMBER(10) NOT NULL,
    FirstName NVARCHAR2(50) NOT NULL,
    LastName NVARCHAR2(50) NOT NULL,
    PhoneNumber VARCHAR2(20) NULL,
    DateOfBirth DATE NULL,
    ProfileImageURL VARCHAR2(500) NULL,
    LastUpdated TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

ALTER TABLE UserProfiles ADD CONSTRAINT PK_UserProfiles PRIMARY KEY (ProfileID);
ALTER TABLE UserProfiles ADD CONSTRAINT UQ_UserProfiles_UserID UNIQUE (UserID);
ALTER TABLE UserProfiles ADD CONSTRAINT FK_UserProfiles_Users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE;

-- =============================================
-- 3. PROJECT & TASK MANAGEMENT
-- =============================================

-- Primary key as named constraint at end
CREATE TABLE Projects (
    ProjectID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1000 INCREMENT BY 1 NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    DepartmentID NUMBER(10) NOT NULL,
    CompanyID NUMBER(10) NULL,
    ProjectName NVARCHAR2(200) NOT NULL,
    ProjectCode VARCHAR2(30) NOT NULL,
    StartDate DATE DEFAULT SYSDATE NOT NULL,
    EndDate DATE NULL,
    Status VARCHAR2(20) DEFAULT 'Planning' NOT NULL,
    Priority VARCHAR2(20) DEFAULT 'Medium' NOT NULL,
    CompletionPercent NUMBER(5,2) DEFAULT 0 NOT NULL
);

ALTER TABLE Projects ADD CONSTRAINT PK_Projects PRIMARY KEY (ProjectID);
ALTER TABLE Projects ADD CONSTRAINT UQ_ProjectCode_Tenant UNIQUE (ProjectCode, TenantID);
ALTER TABLE Projects ADD CONSTRAINT FK_Projects_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(TenantID);
ALTER TABLE Projects ADD CONSTRAINT FK_Projects_Departments FOREIGN KEY (DepartmentID, TenantID) REFERENCES Departments(DepartmentID, TenantID);
ALTER TABLE Projects ADD CONSTRAINT FK_Projects_Companies FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID);

-- All constraints inline
CREATE TABLE Tasks (
    TaskID NUMBER(15) GENERATED BY DEFAULT AS IDENTITY START WITH 50000 INCREMENT BY 1 PRIMARY KEY,
    ProjectID NUMBER(10) NOT NULL,
    ParentTaskID NUMBER(15) NULL,
    TaskTitle NVARCHAR2(200) NOT NULL,
    TaskDescription NCLOB NULL,
    AssignedToUserID NUMBER(10) NULL,
    Status VARCHAR2(20) DEFAULT 'ToDo' NOT NULL,
    StoryPoints NUMBER(3) DEFAULT 1 NOT NULL,
    DueDate DATE NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT FK_Tasks_Projects FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID) ON DELETE CASCADE,
    CONSTRAINT FK_Tasks_ParentTask FOREIGN KEY (ParentTaskID) REFERENCES Tasks(TaskID),
    CONSTRAINT FK_Tasks_AssignedUser FOREIGN KEY (AssignedToUserID) REFERENCES Users(UserID),
    CONSTRAINT UQ_Task_Project_Title UNIQUE (ProjectID, TaskTitle)
);

-- ALTER for composite foreign key
CREATE TABLE TaskDependencies (
    DependencyID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    TaskID NUMBER(15) NOT NULL,
    DependsOnTaskID NUMBER(15) NOT NULL,
    DependencyType VARCHAR2(20) DEFAULT 'FS' NOT NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

ALTER TABLE TaskDependencies ADD CONSTRAINT PK_TaskDependencies PRIMARY KEY (DependencyID);
ALTER TABLE TaskDependencies ADD CONSTRAINT UQ_Task_Dependency UNIQUE (TaskID, DependsOnTaskID);
ALTER TABLE TaskDependencies ADD CONSTRAINT FK_TaskDependencies_Task FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID);
ALTER TABLE TaskDependencies ADD CONSTRAINT FK_TaskDependencies_DependsOn FOREIGN KEY (DependsOnTaskID) REFERENCES Tasks(TaskID);

-- =============================================
-- 4. RESOURCE & ALLOCATION
-- =============================================

CREATE TABLE ResourceTypes (
    ResourceTypeID NUMBER(3) PRIMARY KEY,
    TypeName VARCHAR2(50) NOT NULL UNIQUE,
    IsBillable CHAR(1) DEFAULT '1' NOT NULL,
    HourlyRate NUMBER(10,2) DEFAULT 0 NOT NULL
);

CREATE TABLE Resources (
    ResourceID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    ResourceTypeID NUMBER(3) NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    ResourceName NVARCHAR2(100) NOT NULL,
    ResourceCode VARCHAR2(30) NOT NULL,
    IsAvailable CHAR(1) DEFAULT '1' NOT NULL,
    DailyCapacity NUMBER(8,2) DEFAULT 8 NOT NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

ALTER TABLE Resources ADD CONSTRAINT PK_Resources PRIMARY KEY (ResourceID);
ALTER TABLE Resources ADD CONSTRAINT UQ_ResourceCode_Tenant UNIQUE (ResourceCode, TenantID);
ALTER TABLE Resources ADD CONSTRAINT FK_Resources_ResourceTypes FOREIGN KEY (ResourceTypeID) REFERENCES ResourceTypes(ResourceTypeID);
ALTER TABLE Resources ADD CONSTRAINT FK_Resources_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(TenantID);

-- Foreign key added via ALTER (different style)
CREATE TABLE ResourceAllocations (
    AllocationID RAW(16) DEFAULT SYS_GUID() NOT NULL,
    ResourceID NUMBER(10) NOT NULL,
    TaskID NUMBER(15) NOT NULL,
    AllocatedHours NUMBER(8,2) NOT NULL,
    AllocationDate DATE DEFAULT SYSDATE NOT NULL,
    IsConfirmed CHAR(1) DEFAULT '0' NOT NULL,
    Notes NVARCHAR2(500) NULL
);

ALTER TABLE ResourceAllocations ADD CONSTRAINT PK_ResourceAllocations PRIMARY KEY (AllocationID);
ALTER TABLE ResourceAllocations ADD CONSTRAINT UQ_Resource_Task_Date UNIQUE (ResourceID, TaskID, AllocationDate);
ALTER TABLE ResourceAllocations ADD CONSTRAINT FK_ResourceAllocations_Resources FOREIGN KEY (ResourceID) REFERENCES Resources(ResourceID);
ALTER TABLE ResourceAllocations ADD CONSTRAINT FK_ResourceAllocations_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID);

-- =============================================
-- 5. TIME TRACKING
-- =============================================

CREATE TABLE TimeEntries (
    TimeEntryID NUMBER(15) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    UserID NUMBER(10) NOT NULL,
    TaskID NUMBER(15) NOT NULL,
    EntryDate DATE DEFAULT SYSDATE NOT NULL,
    HoursWorked NUMBER(5,2) NOT NULL,
    Description NVARCHAR2(500) NULL,
    IsBilled CHAR(1) DEFAULT '0' NOT NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);

ALTER TABLE TimeEntries ADD CONSTRAINT PK_TimeEntries PRIMARY KEY (TimeEntryID);
ALTER TABLE TimeEntries ADD CONSTRAINT FK_TimeEntries_Users FOREIGN KEY (UserID) REFERENCES Users(UserID);
ALTER TABLE TimeEntries ADD CONSTRAINT FK_TimeEntries_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID);
ALTER TABLE TimeEntries ADD CONSTRAINT UQ_TimeEntry_User_Task_Date UNIQUE (UserID, TaskID, EntryDate);

-- =============================================
-- 6. INVOICING & BILLING
-- =============================================

CREATE TABLE BillingRates (
    RateID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    ResourceTypeID NUMBER(3) NOT NULL,
    HourlyRate NUMBER(10,2) NOT NULL,
    EffectiveFrom DATE DEFAULT SYSDATE NOT NULL,
    EffectiveTo DATE NULL
);

ALTER TABLE BillingRates ADD CONSTRAINT PK_BillingRates PRIMARY KEY (RateID);
ALTER TABLE BillingRates ADD CONSTRAINT UQ_Rate_Type_Tenant_Date UNIQUE (TenantID, ResourceTypeID, EffectiveFrom);
ALTER TABLE BillingRates ADD CONSTRAINT FK_BillingRates_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(TenantID);
ALTER TABLE BillingRates ADD CONSTRAINT FK_BillingRates_ResourceTypes FOREIGN KEY (ResourceTypeID) REFERENCES ResourceTypes(ResourceTypeID);

CREATE TABLE Invoices (
    InvoiceID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 10000 INCREMENT BY 1 NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    ProjectID NUMBER(10) NOT NULL,
    InvoiceNumber VARCHAR2(50) NOT NULL,
    IssueDate DATE DEFAULT SYSDATE NOT NULL,
    DueDate DATE NOT NULL,
    TotalAmount NUMBER(18,2) NOT NULL,
    TaxAmount NUMBER(18,2) DEFAULT 0 NOT NULL,
    Status VARCHAR2(20) DEFAULT 'Draft' NOT NULL,
    PaidDate DATE NULL
);

ALTER TABLE Invoices ADD CONSTRAINT PK_Invoices PRIMARY KEY (InvoiceID);
ALTER TABLE Invoices ADD CONSTRAINT UQ_InvoiceNumber_Tenant UNIQUE (InvoiceNumber, TenantID);
ALTER TABLE Invoices ADD CONSTRAINT FK_Invoices_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(TenantID);
ALTER TABLE Invoices ADD CONSTRAINT FK_Invoices_Projects FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID);

-- Foreign key with ON DELETE SET NULL
CREATE TABLE InvoiceLineItems (
    LineItemID NUMBER(15) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    InvoiceID NUMBER(10) NOT NULL,
    TimeEntryID NUMBER(15) NULL,
    Description NVARCHAR2(255) NOT NULL,
    Quantity NUMBER(10,2) DEFAULT 1 NOT NULL,
    UnitPrice NUMBER(18,2) NOT NULL,
    LineTotal NUMBER(18,2) GENERATED ALWAYS AS (Quantity * UnitPrice) VIRTUAL
);

ALTER TABLE InvoiceLineItems ADD CONSTRAINT PK_InvoiceLineItems PRIMARY KEY (LineItemID);
ALTER TABLE InvoiceLineItems ADD CONSTRAINT FK_InvoiceLineItems_Invoices FOREIGN KEY (InvoiceID) REFERENCES Invoices(InvoiceID) ON DELETE CASCADE;
ALTER TABLE InvoiceLineItems ADD CONSTRAINT FK_InvoiceLineItems_TimeEntries FOREIGN KEY (TimeEntryID) REFERENCES TimeEntries(TimeEntryID) ON DELETE SET NULL;

-- =============================================
-- 7. NOTIFICATIONS & AUDIT
-- =============================================

CREATE TABLE NotificationTypes (
    NotificationTypeID NUMBER(5) NOT NULL,
    TypeName VARCHAR2(50) NOT NULL,
    DefaultTemplate NVARCHAR2(500) NULL
);

ALTER TABLE NotificationTypes ADD CONSTRAINT PK_NotificationTypes PRIMARY KEY (NotificationTypeID);
ALTER TABLE NotificationTypes ADD CONSTRAINT UQ_NotificationTypeName UNIQUE (TypeName);

CREATE TABLE Notifications (
    NotificationID RAW(16) DEFAULT SYS_GUID() NOT NULL,
    UserID NUMBER(10) NOT NULL,
    NotificationTypeID NUMBER(5) NOT NULL,
    Title NVARCHAR2(200) NOT NULL,
    Message NCLOB NOT NULL,
    IsRead CHAR(1) DEFAULT '0' NOT NULL,
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    ReadAt TIMESTAMP NULL,
    MetadataJSON CLOB NULL
);

ALTER TABLE Notifications ADD CONSTRAINT PK_Notifications PRIMARY KEY (NotificationID);
ALTER TABLE Notifications ADD CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE;
ALTER TABLE Notifications ADD CONSTRAINT FK_Notifications_NotificationTypes FOREIGN KEY (NotificationTypeID) REFERENCES NotificationTypes(NotificationTypeID);

-- Audit log with all constraints via ALTER
CREATE TABLE AuditLog (
    AuditID NUMBER(15) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    TenantID NUMBER(10) NOT NULL,
    UserID NUMBER(10) NULL,
    TableName VARCHAR2(100) NOT NULL,
    RecordID VARCHAR2(100) NOT NULL,
    ActionType VARCHAR2(20) NOT NULL,
    OldValueXML XMLTYPE NULL,
    NewValueXML XMLTYPE NULL,
    ChangedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    IPAddress VARCHAR2(45) NULL
);

ALTER TABLE AuditLog ADD CONSTRAINT PK_AuditLog PRIMARY KEY (AuditID);
ALTER TABLE AuditLog ADD CONSTRAINT FK_AuditLog_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(TenantID);
ALTER TABLE AuditLog ADD CONSTRAINT FK_AuditLog_Users FOREIGN KEY (UserID) REFERENCES Users(UserID);
ALTER TABLE AuditLog MODIFY UserID DEFAULT USER;

-- =============================================
-- 8. MILESTONES & DELIVERABLES
-- =============================================

CREATE TABLE Milestones (
    MilestoneID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    ProjectID NUMBER(10) NOT NULL,
    MilestoneName NVARCHAR2(200) NOT NULL,
    TargetDate DATE NOT NULL,
    ActualCompletionDate DATE NULL,
    Status VARCHAR2(20) DEFAULT 'Pending' NOT NULL,
    Budget NUMBER(18,2) NULL
);

ALTER TABLE Milestones ADD CONSTRAINT PK_Milestones PRIMARY KEY (MilestoneID);
ALTER TABLE Milestones ADD CONSTRAINT FK_Milestones_Projects FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID);
ALTER TABLE Milestones ADD CONSTRAINT UQ_Milestone_Project_Name UNIQUE (ProjectID, MilestoneName);

CREATE TABLE Deliverables (
    DeliverableID NUMBER(10) GENERATED BY DEFAULT AS IDENTITY START WITH 1 INCREMENT BY 1 NOT NULL,
    MilestoneID NUMBER(10) NOT NULL,
    DeliverableName NVARCHAR2(200) NOT NULL,
    Description NVARCHAR2(500) NULL,
    ExpectedOutput NVARCHAR2(500) NOT NULL,
    IsCompleted CHAR(1) DEFAULT '0' NOT NULL,
    CompletedAt TIMESTAMP NULL
);

ALTER TABLE Deliverables ADD CONSTRAINT PK_Deliverables PRIMARY KEY (DeliverableID);
ALTER TABLE Deliverables ADD CONSTRAINT FK_Deliverables_Milestones FOREIGN KEY (MilestoneID) REFERENCES Milestones(MilestoneID);
ALTER TABLE Deliverables ADD CONSTRAINT UQ_Deliverable_Milestone_Name UNIQUE (MilestoneID, DeliverableName);

-- =============================================
-- INDEXES for Performance Optimization
-- =============================================

-- Single column indexes
CREATE INDEX IX_Users_TenantID ON Users(TenantID);
CREATE INDEX IX_Users_RoleID ON Users(RoleID);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Username ON Users(Username);

CREATE INDEX IX_Projects_TenantID ON Projects(TenantID);
CREATE INDEX IX_Projects_DepartmentID ON Projects(DepartmentID);
CREATE INDEX IX_Projects_Status ON Projects(Status);
CREATE INDEX IX_Projects_StartDate ON Projects(StartDate);

CREATE INDEX IX_Tasks_ProjectID ON Tasks(ProjectID);
CREATE INDEX IX_Tasks_AssignedToUserID ON Tasks(AssignedToUserID);
CREATE INDEX IX_Tasks_Status ON Tasks(Status);
CREATE INDEX IX_Tasks_DueDate ON Tasks(DueDate);

CREATE INDEX IX_TimeEntries_UserID ON TimeEntries(UserID);
CREATE INDEX IX_TimeEntries_TaskID ON TimeEntries(TaskID);
CREATE INDEX IX_TimeEntries_EntryDate ON TimeEntries(EntryDate);
CREATE INDEX IX_TimeEntries_IsBilled ON TimeEntries(IsBilled);

CREATE INDEX IX_ResourceAllocations_ResourceID ON ResourceAllocations(ResourceID);
CREATE INDEX IX_ResourceAllocations_TaskID ON ResourceAllocations(TaskID);
CREATE INDEX IX_ResourceAllocations_AllocationDate ON ResourceAllocations(AllocationDate);

CREATE INDEX IX_Invoices_TenantID ON Invoices(TenantID);
CREATE INDEX IX_Invoices_ProjectID ON Invoices(ProjectID);
CREATE INDEX IX_Invoices_Status ON Invoices(Status);
CREATE INDEX IX_Invoices_DueDate ON Invoices(DueDate);

CREATE INDEX IX_InvoiceLineItems_InvoiceID ON InvoiceLineItems(InvoiceID);
CREATE INDEX IX_InvoiceLineItems_TimeEntryID ON InvoiceLineItems(TimeEntryID);

CREATE INDEX IX_Notifications_UserID ON Notifications(UserID);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
CREATE INDEX IX_Notifications_CreatedAt ON Notifications(CreatedAt);

CREATE INDEX IX_AuditLog_TenantID ON AuditLog(TenantID);
CREATE INDEX IX_AuditLog_TableName ON AuditLog(TableName);
CREATE INDEX IX_AuditLog_ChangedAt ON AuditLog(ChangedAt);
CREATE INDEX IX_AuditLog_ActionType ON AuditLog(ActionType);

-- Composite indexes for common query patterns (Oracle specific)
CREATE INDEX IX_Tasks_Project_Status ON Tasks(ProjectID, Status);
CREATE INDEX IX_TimeEntries_User_Date ON TimeEntries(UserID, EntryDate);
CREATE INDEX IX_ResourceAllocations_Resource_Date ON ResourceAllocations(ResourceID, AllocationDate);
CREATE INDEX IX_Invoices_Tenant_Status ON Invoices(TenantID, Status);
CREATE INDEX IX_Notifications_User_Read ON Notifications(UserID, IsRead, CreatedAt DESC);

-- Bitmap indexes for low-cardinality columns (Oracle feature)
CREATE BITMAP INDEX IX_Tasks_Status_BMP ON Tasks(Status);
CREATE BITMAP INDEX IX_Projects_Status_BMP ON Projects(Status);
CREATE BITMAP INDEX IX_Invoices_Status_BMP ON Invoices(Status);
CREATE BITMAP INDEX IX_Users_IsLocked_BMP ON Users(IsLocked);

-- Function-based index (Oracle specific)
CREATE INDEX IX_Users_Email_Upper ON Users(UPPER(Email));
CREATE INDEX IX_Projects_Code_Upper ON Projects(UPPER(ProjectCode));

-- =============================================
-- Comments for documentation (Oracle style)
-- =============================================

COMMENT ON TABLE Tenants IS 'Multi-tenant organizations using the platform';
COMMENT ON TABLE Projects IS 'Projects belonging to specific tenants and departments';
COMMENT ON TABLE Tasks IS 'Work items associated with projects';
COMMENT ON TABLE TimeEntries IS 'Time logged by users against tasks';
COMMENT ON TABLE Invoices IS 'Billing documents for projects and time entries';
COMMENT ON COLUMN Users.PasswordHash IS 'SHA-256 hash of user password';
COMMENT ON COLUMN Tasks.StoryPoints IS 'Agile estimation points for task complexity';
COMMENT ON COLUMN ResourceAllocations.AllocationID IS 'Globally unique identifier using SYS_GUID';




CREATE TABLE ORACLE_ALL_DATATYPES_TEST (
    -- Identity / numeric types
    ID NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    NumberCol NUMBER(18,4) NOT NULL UNIQUE DEFAULT 12345.6789,
    IntegerCol INTEGER NULL DEFAULT 100,
    IntCol INT NOT NULL DEFAULT 200,
    SmallIntCol SMALLINT NULL UNIQUE DEFAULT 50,
    FloatCol FLOAT(20) NOT NULL DEFAULT 123.45,
    BinaryFloatCol BINARY_FLOAT NULL DEFAULT 10.5,
    BinaryDoubleCol BINARY_DOUBLE NOT NULL DEFAULT 99.999,

    -- Character types
    CharCol CHAR(10) NOT NULL DEFAULT 'CHARVAL',
    NCharCol NCHAR(20) NULL DEFAULT N'NCHARVAL',
    VarChar2Col VARCHAR2(255) NOT NULL UNIQUE DEFAULT 'varchar2 text',
    NVarChar2Col NVARCHAR2(200) NULL DEFAULT N'nvarchar2 text',
    ClobCol CLOB NULL,
    NClobCol NCLOB NULL,

    -- RAW / binary
    RawCol RAW(100) NOT NULL ,
  
    BlobCol BLOB NULL,

    -- Date & time
    DateCol DATE NOT NULL DEFAULT SYSDATE,
    TimestampCol TIMESTAMP(6) NULL DEFAULT SYSTIMESTAMP,
    TimestampTZCol TIMESTAMP(6) WITH TIME ZONE NOT NULL DEFAULT SYSTIMESTAMP,
    TimestampLTZCol TIMESTAMP(6) WITH LOCAL TIME ZONE NULL DEFAULT SYSTIMESTAMP,
    IntervalYearMonthCol INTERVAL YEAR(4) TO MONTH DEFAULT INTERVAL '2-6' YEAR TO MONTH,
    IntervalDaySecondCol INTERVAL DAY(3) TO SECOND(6)
        DEFAULT INTERVAL '5 12:30:45.123456' DAY TO SECOND,

    -- XML
    XmlTypeCol XMLTYPE NULL,

    -- Row identifier
    RowIdCol ROWID NULL,
    URowIdCol UROWID NULL,

    -- JSON (stored as CLOB/VARCHAR2 in many Oracle versions)
    JsonCol CLOB NULL,

  

    -- Default expressions
    CreatedAt TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL
);


CREATE TABLE all_oracle_types (
  id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,

  -- Numeric types
  col_number_int        NUMBER(10)        NOT NULL DEFAULT 1,
  col_number_decimal    NUMBER(10,2)      NULL DEFAULT 99.99,
  col_numeric           NUMERIC(8,3)      NOT NULL DEFAULT 123.456,
  col_decimal           DECIMAL(12,4)     NULL DEFAULT 456.7890,
  col_float             FLOAT(10)         NULL DEFAULT 1.23,
  col_binary_float      BINARY_FLOAT      NOT NULL DEFAULT 3.14,
  col_binary_double     BINARY_DOUBLE     NULL DEFAULT 6.28318,

  -- Character types
  col_char              CHAR(10)          NOT NULL DEFAULT 'CHARVAL',
  col_nchar             NCHAR(10)         NULL DEFAULT 'NCHARVAL',

  col_varchar2          VARCHAR2(255)     NULL UNIQUE DEFAULT 'varchar2 value',
  col_nvarchar2         NVARCHAR2(100)    NOT NULL DEFAULT 'nvarchar2 value',

  col_clob              CLOB              NULL,
  col_nclob             NCLOB             NULL,

  -- Raw / binary
  col_raw               RAW(16)           NULL,
  col_blob              BLOB              NULL,

  -- Date & time types
  col_date              DATE              NOT NULL DEFAULT DATE '2024-01-01',

  col_timestamp         TIMESTAMP(6)
                                           NOT NULL DEFAULT CURRENT_TIMESTAMP,

  col_timestamp_tz      TIMESTAMP(6) WITH TIME ZONE
                                           NULL DEFAULT CURRENT_TIMESTAMP,

  col_timestamp_ltz     TIMESTAMP(6) WITH LOCAL TIME ZONE
                                           NULL,

  col_interval_ym       INTERVAL YEAR(2) TO MONTH
                                           NULL DEFAULT INTERVAL '1-2' YEAR TO MONTH,

  col_interval_ds       INTERVAL DAY(2) TO SECOND(6)
                                           NULL DEFAULT INTERVAL '3 12:30:45.123456'
                                           DAY TO SECOND,

  -- XML
  col_xml               XMLTYPE           NULL,

  -- JSON (Oracle 21c+ native JSON type)
  col_json              JSON              NULL,

  -- Row identifier
  col_urowid            UROWID            NULL,

  -- Some extra inline UNIQUE columns
  col_unique_number     NUMBER(5)         UNIQUE DEFAULT 500,
  col_unique_text       VARCHAR2(50)      UNIQUE NULL
);

*/