const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post('/',
  [
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'El password no puede ir vacio').not().isEmpty()
  ],
  authController.autenticarUsuario
)

router.get('/', 
  auth,                                        // el middleware auth si lo pongo en index.js como app.use(auth) se va a ejecutar en todos los request aun los que no son de autenticacion. si lo pongo aca, es solo cuando lo necesito
  authController.usuarioAutenticado
)

module.exports = router