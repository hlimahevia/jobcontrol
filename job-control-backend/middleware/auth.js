const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verificamos si viene el header Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso no autorizado: token ausente' });
  }

  // 2. Extraemos el token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificamos y decodificamos el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Adjuntamos la info del usuario a la petición
req.user = {
  id: decoded.id,
  email: decoded.email 
};
    // 5. Continuamos hacia la ruta protegida
    next();

  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
