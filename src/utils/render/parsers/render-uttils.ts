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