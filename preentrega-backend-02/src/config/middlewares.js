export const authorization = (rol) => {
    return async (req, res, next) => {
        //consuktar si existe una sesion activa
        console.log ( "sesion activa?", req.user)
        if (!req.user) return res.status(401).send('No autenticado');
        if (req.user.role !== rol) return res.status(403).send('No autorizado');
        next();
    
}}