/**
 * Fixes charset/collation placement in SQL CREATE TABLE statements
 * @param sql The SQL string to process
 * @returns SQL with properly placed charset/collation clauses
 */
export function fixCharsetPlacement(sql: string): string {
  // Split into lines to handle multi-line cases better
  const lines = sql.split('\n');
  let currentColumn = '';
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Handle table start/end and other non-column lines
    if (isTableStructureLine(trimmed)) {
      if (currentColumn) {
        result.push(processColumn(currentColumn));
        currentColumn = '';
      }
      result.push(line);
      continue;
    }

    // Handle column definitions
    if (trimmed.endsWith(',')) {
      currentColumn += ' ' + trimmed.slice(0, -1);
      result.push(processColumn(currentColumn) + ',');
      currentColumn = '';
    } else {
      currentColumn += ' ' + trimmed;
    }
  }
  // Process any remaining column
  if (currentColumn) {
    result.push(processColumn(currentColumn));
  }
  return result.join('\n');
}

/**
 * Checks if a line is part of table structure (not a column definition)
 */
function isTableStructureLine(line: string): boolean {
  return line.startsWith('CREATE TABLE') ||
    line === '(' ||
    line === ')' ||
    line.endsWith('(') ||
    line.endsWith(')');
}

/**
 * Processes individual column definitions to fix charset/collation placement
 */

function processColumn(columnDef: string): string {
  // Extract column name and data type
  const typeMatch = columnDef.match(/^\s*(\w+)\s+(\w+(?:\([^)]*\))?)/i);
  if (!typeMatch) return columnDef;

  const [_, colName, dataType] = typeMatch;
  const rest = columnDef.slice(typeMatch[0].length);

  // Extract charset and collate
  const charsetMatch = rest.match(/CHARACTER\s+SET\s+\S+/i);
  const collateMatch = rest.match(/COLLATE\s+\S+/i);

  // Clean the remaining attributes
  const cleanRest = rest
    .replace(/CHARACTER\s+SET\s+\S+/gi, '')
    .replace(/COLLATE\s+\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Reconstruct in correct order
  let reconstructed = `${colName} ${dataType}`;
  if (charsetMatch) reconstructed += ` ${charsetMatch[0]}`;
  if (collateMatch) reconstructed += ` ${collateMatch[0]}`;
  if (cleanRest) reconstructed += ` ${cleanRest}`;

  return reconstructed;
}


export function fixSQLiteColumnOrder(sql: string): string {
  const lines = sql.split('\n');
  let currentColumn = '';
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (isTableStructureLine(trimmed)) {
      if (currentColumn) {
        result.push(processSQLiteIntegerColumn(currentColumn));
        currentColumn = '';
      }
      result.push(line);
      continue;
    }

    if (trimmed.endsWith(',')) {
      currentColumn += ' ' + trimmed.slice(0, -1);
      result.push(processSQLiteIntegerColumn(currentColumn) + ',');
      currentColumn = '';
    } else {
      currentColumn += ' ' + trimmed;
    }
  }

  if (currentColumn) result.push(processSQLiteIntegerColumn(currentColumn));
  return result.join('\n');
}

function processSQLiteIntegerColumn(columnDef: string): string {
  // Only process INTEGER columns with PRIMARY KEY and/or AUTOINCREMENT
  const integerPkMatch = columnDef.match(/^\s*(\w+)\s+INTEGER\s+(.*)/i);
  if (!integerPkMatch) return columnDef;

  const [_, colName, rest] = integerPkMatch;

  // Check if this is a PRIMARY KEY column
  const isPrimaryKey = rest.match(/\bPRIMARY\s+KEY\b/i);
  const isAutoIncrement = rest.match(/\bAUTOINCREMENT\b/i);
  const isNotNull = rest.match(/\bNOT\s+NULL\b/i);

  if (!isPrimaryKey && !isAutoIncrement) {
    return columnDef; // Leave non-PK INTEGER columns unchanged
  }

  // Clean the remaining attributes
  let cleanRest = rest
    .replace(/\bPRIMARY\s+KEY\b/gi, '')
    .replace(/\bAUTOINCREMENT\b/gi, '')
    .replace(/\bNOT\s+NULL\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Reconstruct with SQLite's required order
  let reconstructed = `${colName} INTEGER`;

  if (isPrimaryKey) reconstructed += ' PRIMARY KEY';
  if (isAutoIncrement) reconstructed += ' AUTOINCREMENT';
  if (isNotNull) reconstructed += ' NOT NULL';
  if (cleanRest) reconstructed += ` ${cleanRest}`;

  return reconstructed.trim();
}

export interface CircularDependencyError {
  cycle: string[];
  success: boolean;
  message: string;
}