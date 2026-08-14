export function splitBalance(amount: number, currency: string = 'MMK'): { integerPart: string; decimalPart: string; currency: string } {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const parts = formatted.split('.');
  return {
    integerPart: parts[0],
    decimalPart: `.${parts[1]}`,
    currency: currency || 'MMK',
  };
}

export function formatCurrency(amount: number, currency: string = 'MMK'): string {
  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  if (currency === 'MMK' || !currency) {
    return `${num} MMK`;
  }
  return `${num} ${currency}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function maskAccountNumber(accNo: string): string {
  if (!accNo || accNo.length < 4) return '•••• 8829';
  const lastFour = accNo.slice(-4);
  return `•••• ${lastFour}`;
}
