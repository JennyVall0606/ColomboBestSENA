const db = require('../config/database'); // Conexión a MySQL
const bcrypt = require('bcryptjs');

const User = {
  create: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
  },

  findByEmail: (email) => {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  }
};

module.exports = User;
