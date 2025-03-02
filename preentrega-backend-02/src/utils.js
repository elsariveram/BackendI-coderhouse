// para .env (guardar contraseñas y datos no publicos)
import "dotenv/config";

import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname

//Hasheo de contraseña con hashSync

const salt= Number(process.env.SALT_HASH);  // Convertir a número
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(salt));

//validar contraseña
export const isValidPassword = (passIngresada, passDB) => bcrypt.compareSync(passIngresada, passDB);

const passwordEncrypted = createHash("coder")
console.log(passwordEncrypted)

const isValid = isValidPassword("coder", passwordEncrypted)

    console.log(isValid)


//JWT


export const generateToken = (user) => {
    //parametro1: objeto a guardar (user) , param2: clave privada, param 3: tiempo de vida del token.
   
    const token = jwt.sign({user}, process.env.JWT_SECRET , {expiresIn: '24h'} )
    // antes era (user, secretKey, {expiresIn: '1h'});
    return token
}


// console.log(generateToken({
//             first_name:"e",
//             last_name:"e",
//             email:"e@example.com",
//             age: 19,
//             role: "user"        
//     })) 