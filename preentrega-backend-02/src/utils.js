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

let secretKey = 'coderhouse'
const generateToken = (user) => {
    //parametro1: objeto a guardar (user) , param2: clave privada, param 3: tiempo de vida del token.
    const token = jwt.sign(user, secretKey, {expiresIn: '1h'});
    return token
}

console.log(generateToken({
            first_name:"John",
            last_name:"Doe",
            email:"johndoe@example.com",
            age: 30,
            role: "user"        
    })) 