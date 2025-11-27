const bcrypt = require('bcrypt');

const testPassword = 'Test1234!';
const hashed = '$2b$10$gLbHXSLxoVkMDmv9ZXdgg.gqWCfQzFBl5XI33jj71n5eYf05fE4ja'; // Usa el que aparece en MongoDB

bcrypt.compare(testPassword, hashed).then(result => {
  console.log('¿La contraseña coincide?', result);
});
