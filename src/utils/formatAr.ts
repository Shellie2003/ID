/** Formats an amount as Malagasy Ariary: `58 274 Ar` (no decimals, space separator). */
export function formatAr(amount: number): string {
  const rounded = Math.round(amount);
  const withSpaces = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${rounded < 0 ? '-' : ''}${withSpaces} Ar`;
}

/** Same as formatAr but prefixes a sign (+/-) for transaction rows. */
export function formatArSigned(amount: number): string {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign} ${formatAr(Math.abs(amount)).replace(' Ar', '')} Ar`;
}
