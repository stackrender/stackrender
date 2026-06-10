import { DataType } from "@/lib/schemas/data-type-schema";
import { DatabaseDialect } from "@/lib/database";
import { BaseSqlImporter } from "./base-sql-importer";

export class SqliteImporter extends BaseSqlImporter {
    public constructor(data_types: DataType[]) { 
        super(data_types);
        this.dialect = DatabaseDialect.SQLITE;
    }
}




/*
CREATE TABLE "users" (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "projects" (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL DEFAULT 'Hello world'
);

CREATE TABLE "tasks" (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  project_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NULL,
  due_date DATETIME NULL,
  priority TEXT NULL,
  status TEXT NULL,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE
);

CREATE TABLE "comments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  task_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE
);

CREATE TABLE "task_assignments" (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  task_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  assigned_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("task_id") REFERENCES "tasks" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
)
*/