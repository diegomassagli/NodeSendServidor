require('dotenv').config({ path: 'variables.env'})
const { validationResult } = require('express-validator') 
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization') // en postman va en authorization como bearer token
  if(authHeader) {
    // Obtener el tokon y comprobar si es valido
    const token = authHeader.split(' ')[1]          // separo por espacion en blanco y que quedo con el segund elemento (dejo afuera el "Bearer Token")

    // comprobar el jwt
    try {
      const usuario = jwt.verify(token, process.env.SECRETA)
      req.usuario = usuario      

    } catch (error) {
      console.log(error)
      console.log('JWT no valido')
    }
    
  } 
  
  
  return next();
}
