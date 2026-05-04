export const EARS_VerificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        
        if (rolesPermitidos.includes(req.usuario.rol)) {
            next();
        } else {
            res.status(403).json({ message: 'No tienes los permisos necesarios para esta acción' });
        }
    }
}
