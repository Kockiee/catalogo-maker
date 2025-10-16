/**
 * FUNÇÕES UTILITÁRIAS - HELPER FUNCTIONS
 * 
 * Este arquivo contém funções utilitárias reutilizáveis em toda a aplicação
 * Catálogo Maker. São funções auxiliares que realizam operações comuns
 * como formatação de dados e cálculos de tempo.
 * 
 * Funcionalidades:
 * - Formatação de números de telefone
 * - Cálculo de datas e períodos
 * - Funções auxiliares para manipulação de dados
 */

/**
 * Formata um número de telefone para o padrão brasileiro
 * @param {string} phoneNumber - Número de telefone em formato numérico (ex: "5516997767624")
 * @returns {string} - Número formatado (ex: "+55 (16) 99776-7624")
 */
export function formatPhoneNumber(phoneNumber) {
    // Extrai código do país (primeiros 2 dígitos)
    const countryCode = phoneNumber.substring(0, 2);
    // Extrai DDD (dígitos 3 e 4)
    const ddd = phoneNumber.substring(2, 4);
    // Extrai primeira parte do número (dígitos 5 a 9)
    const firstPart = phoneNumber.substring(4, 9);
    // Extrai segunda parte do número (dígitos 10 em diante)
    const secondPart = phoneNumber.substring(9);
    // Retorna número formatado no padrão brasileiro
    return `+${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
}

/**
 * Verifica se uma data passou de 7 dias ou mais
 * @param {string|Date} date - Data a ser verificada
 * @returns {boolean} - True se passou 7 dias ou mais, false caso contrário
 */
export function passedSevenDaysOrMore(date) {
  // Calcula 7 dias em milissegundos (7 dias × 24 horas × 60 minutos × 60 segundos × 1000 milissegundos)
  const oneWeekInMS = 7 * 24 * 60 * 60 * 1000;
  // Retorna true se a diferença entre hoje e a data for maior ou igual a 7 dias
  return (new Date().getTime() - new Date(date).getTime()) >= oneWeekInMS;
}