const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator') // express-validator tiene 2 funciones "check" para validar que se cumplan determinadas condiciones y validationResult que es el resultado de la validacion.

exports.nuevoUsuario = async ( req, res) => {
  // Mostrar mensajes de error de express-validator
  const errores = validationResult(req)
  if( !errores.isEmpty()) {
    return res.status(400).json({errores: errores.array() })
  }

  // verificar si el usuario ya esta registrado
  const { email, password } = req.body;
  let usuario = await Usuario.findOne({ email })
  if (usuario) {
    return res.status(400).json({ msg: 'El usuario ya esta registrado' })
  }

  // Crear un nuevo usuario
  usuario = new Usuario(req.body)

  // Hashear el password
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt)

  try {
    await usuario.save();    
    res.json( {msg: "Usuario creado correctamente"} )
  } catch (error) {
    console.log(error)
  }


  
}