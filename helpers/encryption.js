const crypto = require("crypto");

// const salt = crypto.randomBytes(16).toString("hex");
const salt = "3689387f7246b15dbd107c1edcbe6cb2";

function encrypt(password) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 16, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString("hex"));
        });
    });
}

const Encryption = { encrypt };

module.exports = Encryption;
