export function formatPhoneNumber(phoneNumber) {
    if (phoneNumber && phoneNumber.length === 14) {
        const countryCode = phoneNumber.substring(0, 2);
        const ddd = phoneNumber.substring(2, 5);
        const firstPart = phoneNumber.substring(5, 10);
        const secondPart = phoneNumber.substring(10);
        return `+${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
    } else {
        return phoneNumber;
    }
}
