const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env'})
const { validationResult } = require('express-validator') 


exports.autenticarUsuario = async (req, res, next) => {
  
  // Mostrar mensajes de error de express-validator
  const errores = validationResult(req)
  if( !errores.isEmpty()) {
    return res.status(400).json({errores: errores.array() })
  }

  // Buscar el usuario para ver si esta registrado
  const { email, password } = req.body
  const usuario = await Usuario.findOne({ email })
  console.log(usuario)

  if(!usuario) {
    res.status(401).json({ msg: 'El usuario no existe' })
    return next()   // es para que no siga con la instruccion siguiente, sino al siguiente middleware (probar con next() o return next() 
  }

  // Verificar el password y autenticar el usuario
  if(bcrypt.compareSync( password, usuario.password )) {
    // Crear JWT
    const token = jwt.sign({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email
    }, process.env.SECRETA, {
      expiresIn: '8h'
    })

    res.json( {token} )  // al armar la respuesta asi, la "llave" del objeto es token: y el valor es el valor del token
  } else {
    res.status(401).json( {msg: 'El password es incorrecto'} )
    return next()
  }
}


exports.usuarioAutenticado = (req, res, next) => {
  res.json({ usuario: req.usuario })
} 
  
