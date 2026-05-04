import { EARS_ConexionDb } from "../../config/EARS-ConexionDb.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const EARS_Login = async (identificacion, password) => {
    const [rows] = await EARS_ConexionDb.query('select * from personas where identificacion = ?', [identificacion]);
    if (rows.length === 0) {
        throw new Error('Usuario no encontrado');
    }
    const persona = rows[0];
    const passwordValido = await bcrypt.compare(password, persona.password) || password === persona.password;
    if (!passwordValido) {
        throw new Error('Contraseña incorrecta');
    }

    const payload = {
        id_persona: persona.id_persona,
        rol: persona.rol
    };

    const secret = process.env.JWT_SECRET || 'EARS_SECRET_KEY';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });

    await EARS_ConexionDb.query('update personas set token = ? where id_persona = ?', [token, persona.id_persona]);

    delete persona.password;
    persona.token = token;

    return persona;
}
