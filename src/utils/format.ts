/**
 * Format a number according to the specified rules:
 * - If the result is less than 0.1 or greater than 10,000 --> Scientific notation with 3 significant figures
 * - If the result is between 0.01 and 10,000 --> Numerical display with 3 significant figures
 * @param value The number to format
 * @returns Formatted string representation of the number
 */
export function formatImpactValue(value: number): string {
  // Handle zero case
  if (value === 0) return '0';

  // Get the absolute value for comparison
  const absValue = Math.abs(value);

  // Case 1: Less than 0.1 or greater than 10,000
  if (absValue < 0.1 || absValue > 10000) {
    return value.toExponential(2); // This will give us 3 significant figures
  }

  // Case 2: Between 0.01 and 10,000
  // First, get the number of significant figures we want
  const significantFigures = 3;
  
  // Convert to string with maximum precision
  let str = value.toString();
  
  // If it's already in scientific notation, convert it back
  if (str.includes('e')) {
    str = Number(value).toFixed(20);
  }
  
  // Remove trailing zeros after decimal point
  str = str.replace(/\.?0+$/, '');
  
  // Count significant figures
  const significantDigits = str.replace(/[^0-9]/g, '').length;
  
  // If we have more significant figures than needed, round
  if (significantDigits > significantFigures) {
    const rounded = Number(value).toPrecision(significantFigures);
    // Remove trailing zeros after decimal point
    return rounded.replace(/\.?0+$/, '');
  }
  
  return str;
}

/**
 * Format a percentage with 2 decimal places
 * @param value The percentage value to format (e.g. 12.3456)
 * @returns Formatted percentage string (e.g. "12.35%")
 */
export function formatPercentage(value: number): string {
  if (value === 0) return '0.00%';
  if (value === 100) return '100.00%';
  
  return `${value.toFixed(2)}%`;
} 