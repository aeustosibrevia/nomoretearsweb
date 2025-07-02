const fs = require('fs').promises;
const path = require('path');
const USERS_FILE = path.join(__dirname, '../users.json');

exports.loadUsers = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(USERS_FILE, '[]');
            return [];
        }
        throw err;
    }
};

exports.saveUsers = async (users) => {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

console.log('ABSOLUTE USERS FILE PATH:', USERS_FILE);
