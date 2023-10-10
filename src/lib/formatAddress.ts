export const formatAddress = (address = "", postcode = "", city = "") =>
  (address && address.trim().length > 0
    ? `${address}, ${postcode} ${city}`
    : `${postcode} ${city}`
  ).trim();
