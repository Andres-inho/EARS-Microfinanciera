import jwt from 'jsonwebtoken';

export const EARS_VerificarToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        const secret = process.env.JWT_SECRET || 'EARS_SECRET_KEY';
        
        jwt.verify(token, secret, (err, authData) => {
            if (err) {
                res.status(403).json({ message: 'Token inválido o expirado' });
            } else {
                req.usuario = authData;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Acceso denegado, se requiere token' });
    }
}
