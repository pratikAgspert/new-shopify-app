export function formatIndianAmount(number) {
  // Remove negative sign if present
  number = Math.abs(number);

  // Check if number is in crores
  if (number >= 10000000) {
    let crores = (number / 10000000).toFixed(2);
    // If crores is a whole number, convert it to integer
    if (crores === Math.floor(crores)) {
      return Math.floor(crores) + 'Cr';
    } else {
      // If crores is a decimal, keep it as is
      return crores + 'Cr';
    }
  }
  // Check if number is in lakhs
  if (number >= 100000) {
    let lakhs = (number / 100000).toFixed(2);
    // If lakhs is a whole number, convert it to integer
    if (lakhs === Math.floor(lakhs)) {
      return Math.floor(lakhs) + 'L';
    } else {
      // If lakhs is a decimal, keep it as is
      return lakhs + 'L';
    }
  }
  // Check if number is in thousands
  if (number >= 1000) {
    let thousands = (number / 1000).toFixed(2);
    // If thousands is a whole number, convert it to integer
    if (thousands === Math.floor(thousands)) {
      return Math.floor(thousands) + 'K';
    } else {
      // If thousands is a decimal, keep it as is
      return thousands + 'K';
    }
  }
  // If number is less than 1000, return it as is
  return parseFloat(number).toFixed(2)?.toString();
}

export function formatDateStructure(dateString, formatType = 'DD-MM-YYYY') {
  const parts = dateString?.toLocaleDateString('en-IN').split('/');

  if (formatType === 'YYYY-MM-DD' && parts) {
    return `${parts[2]}-${parts[1]?.padStart(2, '0')}-${parts[0]?.padStart(
      2,
      '0'
    )}`;
  } else if (formatType === 'DD-MM-YYYY' && parts) {
    return `${parts[0]?.padStart(2, '0')}-${parts[1]?.padStart(2, '0')}-${
      parts[2]
    }`;
  } else console.log('Invalid format type');
}
