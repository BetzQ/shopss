export function formatCurrency(value) {
  // Assuming 'value' is a number
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/,00$/, ""); // Removes decimal part if it's .00
}
