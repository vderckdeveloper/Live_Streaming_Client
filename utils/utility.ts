/***
 * generate random string
 * @returns returns random string combination of 'xxx-xxxx-xxx', 3digits - 4digits - 3digits 
 */
const generateRoomCode = () => {
    const getRandomLetter = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    };

    const generateSection = (length: number) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += getRandomLetter();
        }
        return result;
    };

    return `${generateSection(3)}-${generateSection(4)}-${generateSection(3)}`;
}

export {
    generateRoomCode,
}