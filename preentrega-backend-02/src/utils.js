import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname

//Hasheo de contraseña con hashSync

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(15));

//validar contraseña
export const isValidPassword = (passIngresada, passDB) => bcrypt.compareSync(passIngresada, passDB);

const passwordEncrypted = createHash("coder")
console.log(passwordEncrypted)

const isValid = isValidPassword("coder", passwordEncrypted)
console.log(isValid)

//JWT

let secretKey = 'super-secret-key'
const generateToken = (user) => {
    //parametro1: objeto a guardar (user) , param2: clave privada, param 3: tiempo de vida del token.
    const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role }, 
        secretKey, 
        { expiresIn: '1h' }
    )
    // antes era (user, secretKey, {expiresIn: '1h'});
    return token
}

console.log(generateToken({
            first_name:"e",
            last_name:"e",
            email:"e@example.com",
            age: 19,
            role: "user"        
    })) 