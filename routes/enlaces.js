const express = require('express')
const router = express.Router()
const enlacesController = require('../controllers/enlacesController')
const archivosController = require('../controllers/archivosController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')

router.post('/',
  [
    check('nombre', 'Sube un archivo').not().isEmpty(),
    check('nombre_original', 'Sube un archivo').not().isEmpty(),
  ],
  auth,
  enlacesController.nuevoEnlace
);

router.get('/:url',                              // esto es un comodin, osea que va a reaccionar a /api/archivos/20123 o /api/archivos/54331, etc)
  enlacesController.tienePassword,
  enlacesController.obtenerEnlace
)


router.post('/:url', 
  enlacesController.verificarPassword,
  enlacesController.obtenerEnlace
)


router.get('/',
  enlacesController.todosEnlaces
)






module.exports = router