const crypto = require('crypto')
const bcrypt = require('bcrypt');

// const hashString = async (string) => {
//   try {
//     const hashedString = await bcrypt.hash(string, 10); // You can adjust the salt rounds as needed
//     return hashedString;
//   } catch (error) {
//     throw new Error('Hashing failed'); 
//   }
// };

const hashString = (string) => {
    try {
      return SHA256(string).toString();
    } catch (error) {
      throw new Error('Hashing failed');
    } 
  };

// const hashString = (string) => crypto.createHash(string).digest('hex')

module.exports = hashString