export function formatPhoneNumber(phoneNumber) {
    const countryCode = phoneNumber.substring(0, 2);
    const ddd = phoneNumber.substring(2, 4);
    const firstPart = phoneNumber.substring(4, 9);
    const secondPart = phoneNumber.substring(9);
    return `+${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
}

export function passedSevenDaysOrMore(date) {
  const oneWeekInMS = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
  return (new Date().getTime() - new Date(date).getTime()) >= oneWeekInMS;
}