import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { BaseSqlImporter, ExtractedStatments, ParsedDatabaase, ParsedField } from "./base-sql-importer";
import { TableInsertType } from "@/lib/schemas/table-schema";
import { FieldInsertType } from "@/lib/schemas/field-schema";
import { TimeDefaultValues } from "@/lib/field";

export class MSSQLImporter extends BaseSqlImporter {


    private dfConstraints: string[] = [];

    public constructor(data_types: DataType[]) {
        super(data_types);
        this.dialect = DatabaseDialect.MSSQL;
    }

    public parseSql(sql: string) {
        try {
            this.dfConstraints = [];
            const parsedDatabaase: ParsedDatabaase = super.parseSql(sql);
            for (const constraint of this.dfConstraints) {
                try {
                    this.processDefaultValueConstraint(constraint, parsedDatabaase.tables);
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
        // get field defintion options
        const options: any | undefined = [] = ast.options;
        for (const option of options) {
            if (option.option?.Identity) {
                field.autoIncrement = true;
            }
        }

        return { field, fk_constraint };
    }
    private processDefaultValueConstraint(constraint: string, tables: TableInsertType[]) {
        const regex =
            /ALTER\s+TABLE\s+(?:(?:\[(?<schema1>[^\]]+)\]|(?<schema2>\w+))\.)?(?:\[(?<table1>[^\]]+)\]|(?<table2>\w+))\s+ADD\s+CONSTRAINT\s+(?:\[(?<constraint1>[^\]]+)\]|(?<constraint2>\w+))\s+DEFAULT\s*\((?<defaultValue>.*?)\)\s+FOR\s+(?:\[(?<column1>[^\]]+)\]|(?<column2>\w+))/is;

        const match = constraint.match(regex);

        if (match?.groups) {
            const schema =
                match.groups.schema1 || match.groups.schema2 || null;

            const tableName =
                match.groups.table1 || match.groups.table2;

            const constraint =
                match.groups.constraint1 || match.groups.constraint2;

            const column =
                match.groups.column1 || match.groups.column2;

            const defaultValue =
                match.groups.defaultValue?.trim()
                    // remove only wrapping parentheses around the whole value
                    .replace(/^\((.*)\)$/s, "$1")

                    // repeat once more for cases like ((1))
                    .replace(/^\((.*)\)$/s, "$1")

                    // remove surrounding quotes
                    .replace(/^['"](.*)['"]$/s, "$1");


            if (tableName && column && defaultValue) {
                const table: TableInsertType | undefined = tables.find((table: TableInsertType) => table.name == tableName);
                if (!table)
                    throw Error("Table in DF constraint not found : " + constraint);

                const field: FieldInsertType | undefined = table.fields?.find((field: FieldInsertType) => field.name == column);
                if (!field) {
                    throw Error("field not found in DF constraint : " + constraint);
                }

                const isFunctionRegex =
                    /^[a-zA-Z_][a-zA-Z0-9_]*\s*\([^()]*\)$/;

                if (isFunctionRegex.test(defaultValue)) {
                    // in case the default value is a function sysdatetimeoffset()  , CONVERT([date],getdate()) ... ect
                    // if it's a function of time current timestamp. 
                    const upperDefaultValue: string = defaultValue.toUpperCase();
                    if (upperDefaultValue.includes("GETDATE") || upperDefaultValue.includes("SYSDATETIME") || upperDefaultValue.includes("SYSDATETIMEOFFSET")) {
                        field.defaultValue = TimeDefaultValues.NOW;
                    } else if (upperDefaultValue.includes("NEWID")) {

                        field.defaultValue = "random";
                    }

                } else {
                    field.defaultValue = defaultValue;
                }

            } else
                throw Error("Failed to process a MSSQL DF constraint : " + constraint);
        }

    }
    protected processDefaultValue(ast: any, dataType: DataType): string | undefined {
        let defaultValue: string | undefined = super.processDefaultValue(ast, dataType);
        if (dataType.name == "bit" && defaultValue) {
            return defaultValue == "1" ? "true" : "false";
        }
        else if (!defaultValue && dataType.name == "uniqueidentifier") {
            if (ast.Function) {
                if (ast.Function.name?.[0]?.Identifier?.value && (ast.Function.name?.[0]?.Identifier?.value == "NEWSEQUENTIALID" || ast.Function.name?.[0]?.Identifier?.value == "NEWID")) {
                    return "random";
                }
            }
            return defaultValue
        }
        return defaultValue;
    }
    protected isCurrentTimesTampFunction(value: string): boolean {
        return value == "GETDATE" || value == "SYSDATETIME" || value == "SYSDATETIMEOFFSET";
    }

    protected cleanSql(sql: string): string {
        const cleanedSql = sql  // remove GO batches
            .replace(/([^;\s])\s*\r?\nGO\b/gm, '$1;')
            .replace(/^\s*GO\s*$/gm, '')


            // remove WITH CHECK
            .replace(/\bWITH\s+CHECK\b\s*/gi, '')

            // remove CHECK CONSTRAINT enable statements (FK validation step)
            .replace(
                /ALTER TABLE\s+\[?.*?\]?\.?\[?.*?\]?\s+CHECK\s+CONSTRAINT\s+\[?.*?\]?;\s*/gi,
                ''
            )
            // remove computed columns 
            .replace(
                /^\s*(?:\[[^\]]+\]|\w+)\s+AS\s+.*?(?:PERSISTED\s*)?,?\s*$/gim,
                ''
            )
            .replace(
                /(\[[^\]]+\]|\w+)\s+([^,]*?)\s+FOREIGN\s+KEY\s+REFERENCES\s+([^\s,()]+)\s*\(\s*([^\s,()]+)\s*\)/gi,
                (_match, col, beforeRefs, table, refCol) => {
                    return `${col} ${beforeRefs.trim()} REFERENCES ${table}(${refCol})`;
                }
            )
            // remove CLUSTERED / NONCLUSTERED
            .replace(/\bCLUSTERED\b/g, '')
            .replace(/\bNONCLUSTERED\b/g, '')

            // remove ASC / DESC inside constraints
            .replace(/\s+\bASC\b/g, '')
            .replace(/\s+\bDESC\b/g, '')

            // remove WITH (...) ON [PRIMARY]
            .replace(/\)\s*WITH\s*\([^)]+\)\s*ON\s*\[[^\]]+\]/g, ')')

            // remove trailing table storage clauses
            .replace(/\)\s*ON\s*\[[^\]]+\](\s*TEXTIMAGE_ON\s*\[[^\]]+\])?/g, ')')

            // cleanup extra spaces
            .replace(/[ \t]+/g, ' ')
            .replace(/\n\s+\n/g, '\n\n');


        return super.cleanSql(cleanedSql);
    }

    protected extractStatments(sql: string): ExtractedStatments {

        const statments: ExtractedStatments = super.extractStatments(sql);

        statments.alterTableStatements = statments.alterTableStatements.filter((statment: string) => {
            if (/ALTER\s+TABLE\s+\[[^\]]+\]\.\[[^\]]+\]\s+ADD\s+CONSTRAINT\s+\[[^\]]+\]\s+DEFAULT\s*\(.*?\)\s+FOR\s+\[[^\]]+\]/i.test(statment)) {

                this.dfConstraints.push(statment);

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
-- Enterprise E-Commerce Platform Database
-- Version: 1.0 (No CHECK Constraints)
-- =============================================

-- Drop database if exists (for clean creation)
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'ECommerceDB')
BEGIN
    ALTER DATABASE ECommerceDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ECommerceDB;
END
GO

CREATE DATABASE ECommerceDB;
GO

USE ECommerceDB;
GO

-- =============================================
-- 1. Customer Management Schema
-- =============================================

CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerNumber AS 'CUST-' + RIGHT('000000' + CAST(CustomerID AS VARCHAR(6)), 6) PERSISTED,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Phone VARCHAR(20) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NULL,
    TaxID VARCHAR(50) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);

CREATE TABLE CustomerAddresses (
    AddressID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    AddressType VARCHAR(20) NOT NULL, -- Billing, Shipping, Both
    AddressLine1 NVARCHAR(200) NOT NULL,
    AddressLine2 NVARCHAR(200) NULL,
    City NVARCHAR(100) NOT NULL,
    StateProvince NVARCHAR(100) NOT NULL,
    PostalCode VARCHAR(20) NOT NULL,
    CountryCode CHAR(2) NOT NULL,
    IsDefault BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE
);

CREATE TABLE CustomerLoyalty (
    LoyaltyID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL UNIQUE,
    PointsBalance INT NOT NULL DEFAULT 0,
    TierLevel VARCHAR(20) NOT NULL DEFAULT 'Bronze',
    TotalSpent DECIMAL(18,2) NOT NULL DEFAULT 0,
    JoinDate DATE NOT NULL DEFAULT GETDATE(),
    PointsExpiryDate DATE NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE
);

CREATE TABLE CustomerPreferences (
    PreferenceID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL,
    PreferenceKey VARCHAR(50) NOT NULL,
    PreferenceValue NVARCHAR(500) NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE,
    CONSTRAINT UQ_Customer_Preference UNIQUE (CustomerID, PreferenceKey)
);

-- =============================================
-- 2. Product Catalog Schema
-- =============================================

CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    ParentCategoryID INT NULL,
    CategoryName NVARCHAR(100) NOT NULL,
    CategoryCode VARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    DisplayOrder INT NOT NULL DEFAULT 0,
    FOREIGN KEY (ParentCategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE Brands (
    BrandID INT IDENTITY(1,1) PRIMARY KEY,
    BrandName NVARCHAR(100) NOT NULL UNIQUE,
    BrandCode VARCHAR(50) NOT NULL UNIQUE,
    Website VARCHAR(255) NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    SKU VARCHAR(50) NOT NULL UNIQUE,
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    CategoryID INT NOT NULL,
    BrandID INT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Weight DECIMAL(10,3) NOT NULL DEFAULT 0,
    IsTaxable BIT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    ModifiedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (BrandID) REFERENCES Brands(BrandID)
);

CREATE TABLE ProductAttributes (
    AttributeID INT IDENTITY(1,1) PRIMARY KEY,
    AttributeName NVARCHAR(100) NOT NULL UNIQUE,
    DataType VARCHAR(20) NOT NULL -- String, Integer, Decimal, Boolean, Date
);

CREATE TABLE ProductAttributeValues (
    ProductID INT NOT NULL,
    AttributeID INT NOT NULL,
    AttributeValue NVARCHAR(500) NOT NULL,
    PRIMARY KEY (ProductID, AttributeID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (AttributeID) REFERENCES ProductAttributes(AttributeID)
);

CREATE TABLE Inventory (
    InventoryID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    WarehouseCode VARCHAR(20) NOT NULL,
    QuantityOnHand INT NOT NULL DEFAULT 0,
    QuantityReserved INT NOT NULL DEFAULT 0,
    ReorderLevel INT NOT NULL DEFAULT 10,
    ReorderQuantity INT NOT NULL DEFAULT 50,
    LastRestockedDate DATETIME2 NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT UQ_Product_Warehouse UNIQUE (ProductID, WarehouseCode)
);

-- =============================================
-- 3. Pricing & Promotions Schema
-- =============================================

CREATE TABLE PriceTiers (
    TierID INT IDENTITY(1,1) PRIMARY KEY,
    TierName VARCHAR(50) NOT NULL UNIQUE,
    MinQuantity INT NOT NULL,
    DiscountPercentage DECIMAL(5,2) NOT NULL
);

CREATE TABLE ProductPricing (
    PricingID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    TierID INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    EffectiveFrom DATE NOT NULL,
    EffectiveTo DATE NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (TierID) REFERENCES PriceTiers(TierID)
);

CREATE TABLE Promotions (
    PromotionID INT IDENTITY(1,1) PRIMARY KEY,
    PromotionCode VARCHAR(50) NOT NULL UNIQUE,
    PromotionName NVARCHAR(200) NOT NULL,
    DiscountType VARCHAR(20) NOT NULL, -- Percentage, FixedAmount, BuyOneGetOne
    DiscountValue DECIMAL(18,2) NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    MinOrderAmount DECIMAL(18,2) NULL,
    MaxDiscountAmount DECIMAL(18,2) NULL,
    UsageLimit INT NULL,
    UsedCount INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);

CREATE TABLE PromotionApplicability (
    ApplicabilityID INT IDENTITY(1,1) PRIMARY KEY,
    PromotionID INT NOT NULL,
    ApplicableToType VARCHAR(20) NOT NULL, -- AllProducts, SpecificProduct, SpecificCategory, SpecificBrand
    ReferenceID INT NULL,
    FOREIGN KEY (PromotionID) REFERENCES Promotions(PromotionID)
);

-- =============================================
-- 4. Order Management Schema
-- =============================================

CREATE TABLE OrderStatus (
    StatusID INT IDENTITY(1,1) PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL UNIQUE,
    StatusDescription NVARCHAR(200) NULL,
    IsFinalState BIT NOT NULL DEFAULT 0
);

CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    OrderNumber AS 'ORD-' + FORMAT(OrderID, '000000') PERSISTED,
    CustomerID INT NOT NULL,
    OrderDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    StatusID INT NOT NULL,
    PaymentStatus VARCHAR(30) NOT NULL DEFAULT 'Pending', -- Pending, Paid, Failed, Refunded
    ShippingAddressID INT NOT NULL,
    BillingAddressID INT NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    ShippingAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL,
    PromotionID INT NULL,
    Notes NVARCHAR(MAX) NULL,
    OrderWeight DECIMAL(10,3) NOT NULL DEFAULT 0,
    CompletedDate DATETIME2 NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (StatusID) REFERENCES OrderStatus(StatusID),
    FOREIGN KEY (ShippingAddressID) REFERENCES CustomerAddresses(AddressID),
    FOREIGN KEY (BillingAddressID) REFERENCES CustomerAddresses(AddressID),
    FOREIGN KEY (PromotionID) REFERENCES Promotions(PromotionID)
);

CREATE TABLE OrderItems (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    DiscountApplied DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalPrice DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE OrderTracking (
    TrackingID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    StatusID INT NOT NULL,
    StatusDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    Notes NVARCHAR(500) NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (StatusID) REFERENCES OrderStatus(StatusID)
);

-- =============================================
-- 5. Payment & Transaction Schema
-- =============================================

CREATE TABLE PaymentMethods (
    PaymentMethodID INT IDENTITY(1,1) PRIMARY KEY,
    MethodName VARCHAR(50) NOT NULL UNIQUE, -- CreditCard, PayPal, BankTransfer, Cash
    IsActive BIT NOT NULL DEFAULT 1,
    ProcessingFee DECIMAL(5,2) NOT NULL DEFAULT 0
);

CREATE TABLE Currencies (
    CurrencyID INT IDENTITY(1,1) PRIMARY KEY,
    CurrencyCode CHAR(3) NOT NULL UNIQUE, -- USD, EUR, GBP, JPY
    CurrencyName NVARCHAR(50) NOT NULL,
    ExchangeRateToUSD DECIMAL(18,6) NOT NULL,
    IsBaseCurrency BIT NOT NULL DEFAULT 0
);

CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    PaymentMethodID INT NOT NULL,
    CurrencyID INT NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    PaymentDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    TransactionID VARCHAR(100) NULL,
    PaymentStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    GatewayResponse NVARCHAR(MAX) NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (PaymentMethodID) REFERENCES PaymentMethods(PaymentMethodID),
    FOREIGN KEY (CurrencyID) REFERENCES Currencies(CurrencyID)
);

CREATE TABLE Refunds (
    RefundID INT IDENTITY(1,1) PRIMARY KEY,
    PaymentID INT NOT NULL,
    RefundAmount DECIMAL(18,2) NOT NULL,
    RefundDate DATETIME2 NOT NULL DEFAULT GETDATE(),
    Reason NVARCHAR(500) NULL,
    ApprovalStatus VARCHAR(30) NOT NULL DEFAULT 'Pending',
    ProcessedBy INT NULL,
    FOREIGN KEY (PaymentID) REFERENCES Payments(PaymentID)
);

-- =============================================
-- 6. Shipping & Logistics Schema
-- =============================================

CREATE TABLE ShippingMethods (
    ShippingMethodID INT IDENTITY(1,1) PRIMARY KEY,
    MethodName VARCHAR(100) NOT NULL UNIQUE, -- Standard, Express, Overnight
    EstimatedDeliveryDays INT NOT NULL,
    BaseCost DECIMAL(18,2) NOT NULL,
    CostPerKg DECIMAL(18,2) NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1
);

CREATE TABLE Shipments (
    ShipmentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ShippingMethodID INT NOT NULL,
    TrackingNumber VARCHAR(100) NULL,
    CarrierName VARCHAR(100) NOT NULL,
    ShippedDate DATETIME2 NULL,
    DeliveredDate DATETIME2 NULL,
    ShippingCost DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ShippingMethodID) REFERENCES ShippingMethods(ShippingMethodID)
);

CREATE TABLE Warehouses (
    WarehouseID INT IDENTITY(1,1) PRIMARY KEY,
    WarehouseCode VARCHAR(20) NOT NULL UNIQUE,
    WarehouseName NVARCHAR(100) NOT NULL,
    LocationAddress NVARCHAR(500) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    CountryCode CHAR(2) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Add WarehouseCode foreign key to Inventory
ALTER TABLE Inventory ADD WarehouseID INT NULL;
ALTER TABLE Inventory ADD FOREIGN KEY (WarehouseID) REFERENCES Warehouses(WarehouseID);
ALTER TABLE Inventory ALTER COLUMN WarehouseCode VARCHAR(20) NULL;

-- =============================================
-- 7. Reviews & Ratings Schema
-- =============================================

CREATE TABLE ProductReviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    CustomerID INT NOT NULL,
    Rating INT NOT NULL, -- 1 to 5 stars
    Title NVARCHAR(200) NULL,
    ReviewText NVARCHAR(MAX) NULL,
    IsVerifiedPurchase BIT NOT NULL DEFAULT 0,
    HelpfulCount INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsApproved BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE ReviewHelpfulness (
    HelpfulnessID INT IDENTITY(1,1) PRIMARY KEY,
    ReviewID INT NOT NULL,
    CustomerID INT NOT NULL,
    IsHelpful BIT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (ReviewID) REFERENCES ProductReviews(ReviewID) ON DELETE CASCADE,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    CONSTRAINT UQ_Review_Customer UNIQUE (ReviewID, CustomerID)
);

-- =============================================
-- 8. Shopping Cart Schema
-- =============================================

CREATE TABLE ShoppingCarts (
    CartID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastModified DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID) ON DELETE CASCADE
);

CREATE TABLE CartItems (
    CartItemID INT IDENTITY(1,1) PRIMARY KEY,
    CartID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    AddedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (CartID) REFERENCES ShoppingCarts(CartID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- =============================================
-- INDEXES for Performance
-- =============================================

-- Customers indexes
CREATE INDEX IX_Customers_Email ON Customers(Email);
CREATE INDEX IX_Customers_LastName ON Customers(LastName);
CREATE INDEX IX_Customers_CreatedAt ON Customers(CreatedAt);

-- CustomerAddresses indexes
CREATE INDEX IX_CustomerAddresses_CustomerID ON CustomerAddresses(CustomerID);
CREATE INDEX IX_CustomerAddresses_CountryCode ON CustomerAddresses(CountryCode);

-- Products indexes
CREATE INDEX IX_Products_CategoryID ON Products(CategoryID);
CREATE INDEX IX_Products_BrandID ON Products(BrandID);
CREATE INDEX IX_Products_SKU ON Products(SKU);
CREATE INDEX IX_Products_UnitPrice ON Products(UnitPrice);
CREATE INDEX IX_Products_IsActive ON Products(IsActive);

-- Inventory indexes
CREATE INDEX IX_Inventory_ProductID ON Inventory(ProductID);
CREATE INDEX IX_Inventory_WarehouseID ON Inventory(WarehouseID);
CREATE INDEX IX_Inventory_QuantityOnHand ON Inventory(QuantityOnHand);

-- Orders indexes
CREATE INDEX IX_Orders_CustomerID ON Orders(CustomerID);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate);
CREATE INDEX IX_Orders_StatusID ON Orders(StatusID);
CREATE INDEX IX_Orders_PaymentStatus ON Orders(PaymentStatus);
CREATE INDEX IX_Orders_TotalAmount ON Orders(TotalAmount);

-- OrderItems indexes
CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);
CREATE INDEX IX_OrderItems_ProductID ON OrderItems(ProductID);

-- Payments indexes
CREATE INDEX IX_Payments_OrderID ON Payments(OrderID);
CREATE INDEX IX_Payments_PaymentStatus ON Payments(PaymentStatus);
CREATE INDEX IX_Payments_PaymentDate ON Payments(PaymentDate);

-- Shipments indexes
CREATE INDEX IX_Shipments_OrderID ON Shipments(OrderID);
CREATE INDEX IX_Shipments_TrackingNumber ON Shipments(TrackingNumber);
CREATE INDEX IX_Shipments_ShippedDate ON Shipments(ShippedDate);

-- ProductReviews indexes
CREATE INDEX IX_ProductReviews_ProductID ON ProductReviews(ProductID);
CREATE INDEX IX_ProductReviews_CustomerID ON ProductReviews(CustomerID);
CREATE INDEX IX_ProductReviews_Rating ON ProductReviews(Rating);
CREATE INDEX IX_ProductReviews_CreatedAt ON ProductReviews(CreatedAt);

-- Promotions indexes
CREATE INDEX IX_Promotions_PromotionCode ON Promotions(PromotionCode);
CREATE INDEX IX_Promotions_StartDate_EndDate ON Promotions(StartDate, EndDate);

-- OrderTracking indexes
CREATE INDEX IX_OrderTracking_OrderID ON OrderTracking(OrderID);
CREATE INDEX IX_OrderTracking_StatusID ON OrderTracking(StatusID);
CREATE INDEX IX_OrderTracking_StatusDate ON OrderTracking(StatusDate);

-- CartItems indexes
CREATE INDEX IX_CartItems_CartID ON CartItems(CartID);
CREATE INDEX IX_CartItems_ProductID ON CartItems(ProductID);

-- Composite indexes for common query patterns
CREATE INDEX IX_Orders_Customer_Date ON Orders(CustomerID, OrderDate DESC);
CREATE INDEX IX_OrderItems_Product_Price ON OrderItems(ProductID, UnitPrice);
CREATE INDEX IX_Products_Category_Price ON Products(CategoryID, UnitPrice);

-- =============================================
-- Insert initial reference data
-- =============================================

-- Order Status
INSERT INTO OrderStatus (StatusName, StatusDescription, IsFinalState) VALUES
('Pending', 'Order placed but not processed', 0),
('PaymentReceived', 'Payment has been confirmed', 0),
('Processing', 'Order is being prepared', 0),
('Shipped', 'Order has been shipped', 0),
('Delivered', 'Order delivered to customer', 1),
('Cancelled', 'Order cancelled', 1),
('Refunded', 'Order refunded', 1);

-- Payment Methods
INSERT INTO PaymentMethods (MethodName, ProcessingFee) VALUES
('CreditCard', 2.9),
('PayPal', 3.5),
('BankTransfer', 0.5),
('CashOnDelivery', 0.0);

-- Currencies
INSERT INTO Currencies (CurrencyCode, CurrencyName, ExchangeRateToUSD, IsBaseCurrency) VALUES
('USD', 'US Dollar', 1.0, 1),
('EUR', 'Euro', 1.09, 0),
('GBP', 'British Pound', 1.27, 0),
('JPY', 'Japanese Yen', 0.0067, 0);

-- Shipping Methods
INSERT INTO ShippingMethods (MethodName, EstimatedDeliveryDays, BaseCost, CostPerKg) VALUES
('Standard Shipping', 5, 5.99, 1.5),
('Express Shipping', 2, 12.99, 2.5),
('Overnight', 1, 24.99, 4.0);

-- Price Tiers
INSERT INTO PriceTiers (TierName, MinQuantity, DiscountPercentage) VALUES
('Regular', 1, 0),
('Wholesale', 10, 10),
('Bulk', 50, 15),
('Enterprise', 100, 20);

-- Sample Categories
INSERT INTO Categories (CategoryName, CategoryCode, DisplayOrder) VALUES
('Electronics', 'ELEC', 1),
('Clothing', 'CLOTH', 2),
('Books', 'BOOKS', 3),
('Home & Garden', 'HOME', 4);

-- Sample Brands
INSERT INTO Brands (BrandName, BrandCode) VALUES
('TechPro', 'TP001'),
('FashionHub', 'FH002'),
('ReadWell', 'RW003');
*/
