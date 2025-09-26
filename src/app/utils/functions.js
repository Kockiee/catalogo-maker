/**
 * Formata um número de telefone para exibição
 * @param {string} phoneNumber - Número de telefone no formato internacional (ex: 5511999999999)
 * @returns {string} Número formatado (ex: +55 (11) 99999-9999)
 */
export function formatPhoneNumber(phoneNumber) {
    const countryCode = phoneNumber.substring(0, 2);
    const ddd = phoneNumber.substring(2, 4);
    const firstPart = phoneNumber.substring(4, 9);
    const secondPart = phoneNumber.substring(9);
    return `+${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
}

/**
 * Verifica se passaram 7 dias ou mais desde uma data específica
 * @param {Date|string} date - Data a ser verificada
 * @returns {boolean} Verdadeiro se passaram 7 dias ou mais, falso caso contrário
 */
export function passedSevenDaysOrMore(date) {
  const oneWeekInMS = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
  return (new Date().getTime() - new Date(date).getTime()) >= oneWeekInMS;
}