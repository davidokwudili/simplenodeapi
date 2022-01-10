const bcryptjs = require('bcryptjs');

const encryptPassword = async (password) => {
    // has password using bcrypt
    const hasedPassword = await bcryptjs.hash(password, 12);

    // return hashed password
    return hasedPassword;
}

const comparePassword = async (loginPassword, dbPassword) => {
    // get the typed password and compare with the encrypted db password
    return await bcryptjs.compare(loginPassword, dbPassword);
}

module.exports = { encryptPassword, comparePassword };