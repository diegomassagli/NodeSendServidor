const Enlaces = require('../models/Enlace')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')


exports.nuevoEnlace = async (req, res, next) => {
  console.log(req.body)
  
  // Revisar si hay errores
  // Mostrar mensajes de error de express-validator
  const errores = validationResult(req)
  if( !errores.isEmpty()) {
    return res.status(400).json({errores: errores.array() })
  }

  console.log(req.body)

  // Crear un objeto Enlace
  const { nombre_original, nombre } = req.body

  const enlace = new Enlaces()

  enlace.url = shortid.generate()
  enlace.nombre = nombre
  enlace.nombre_original = nombre_original
  
  // Si el usuario esta autenticado
  if(req.usuario) {
    const { password, descargas } = req.body

    // Asignar a enlace el numero de descargas
    if(descargas) {
      enlace.descargas = descargas
    }
    // Asignar un password
    if(password) {
      const salt = await bcrypt.genSaltSync(10);
      enlace.password = await bcrypt.hash( password, salt );
    }
    // Asignar el autor
    enlace.autor = req.usuario.id
  }

  // Almacenar en la BD
  try {
    await enlace.save();
    return res.json({ msg: `${enlace.url}` });
    next();
  } catch (error) {
   console.log(error) 
  }
}

// Obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
  try {
    const enlaces = await Enlaces.find({}).select('url -_id')
    res.json({enlaces})
  } catch (error) {
    console.log(error)
  }
}


// Retorna si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
  const { url } = req.params                                        // lo recupero de la url por eso es con req.params !!!  y el nombre es "url" porque yo puse /:url podia ser cualqer cosa
    
  // verificar si existe el enlace
  const enlace = await Enlaces.findOne( { url } )
  if (!enlace) {
    res.status(404).json({msg: 'Ese enlace no existe'})
    return next()
  }
  
  if(enlace.password) {
    return res.json({password: true, enlace: enlace.url, archivo: enlace.nombre})
  }

  next();
}


// Verificar Password si es correcto
exports.verificarPassword = async (req, res, next) => {
  const { url } = req.params
  const { password } = req.body;

  // consultar por el enlace
  const enlace = await Enlaces.findOne( { url} )

  // Verificar el password
  if (bcrypt.compareSync( password, enlace.password )) {
    // permitirle al usuario descargar el archivo
    next();

  } else {
    return res.status(401).json({ msg: 'Password Incorrecto'})
  }


// console.log(req.params)
// console.log(req.body)
}





// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {

  const { url } = req.params                                        // lo recupero de la url por eso es con req.params !!!  y el nombre es "url" porque yo puse /:url podia ser cualqer cosa
  // console.log(url)
  
  // verificar si existe el enlace
  const enlace = await Enlaces.findOne( { url } )
  if (!enlace) {
    res.status(404).json({msg: 'Ese enlace no existe'})
    return next()
  }

  // si el enlace existe...
  res.json( { archivo: enlace.nombre, password: false } )             // express para hacer que el archivo se descargue en lugar de mostrarse implemento el content-disposition automatico al poner .donwload en lugar de .json
                                                                      // le pone password false porque o no tenia o ya paso la validacion porque puso password correcto y de esa manera muestra en frontend el boton de descarga
  
  next();


}