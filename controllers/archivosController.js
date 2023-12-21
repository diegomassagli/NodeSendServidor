const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Enlaces = require('../models/Enlace')


exports.subirArchivo = async (req, res, next) => {

  const configuracionMulter = {
    limits: {fileSize: req.usuario ? 10000000 : 1000000 },   // si esta autenticado puede subir 10 megas sino 1 mega
    storage: fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname+'/../uploads')
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, `${shortid.generate()}${extension}`)
      }    
    })
  }
  
  const upload = multer(configuracionMulter).single('archivo')  

  upload( req, res, async (error) => {
      console.log(req.file)
      if (!error) {
        res.json({ archivo: req.file.filename });
      } else {
        console.log(error);
        return next();
      }
  })
}


exports.eliminarArchivo = async (req, res) => {
  console.log(req.archivo)

  try {
    fs.unlinkSync(`uploads/${req.archivo}`)
    console.log('Archivo Eliminado')
  } catch (error) {
    console.log(error)
  }
}


// Descarga un archivo
exports.descargar = async (req, res, next) => {
  //console.log(req.params.archivo)

  // Obtiene el enlace
  const { archivo } = req.params
  const enlace = await Enlaces.findOne( { nombre: archivo } )

  // console.log(enlace)
  
  const archivoDescarga = __dirname + '/../uploads/' + archivo
  res.download(archivoDescarga)                                            // esto implementa el content-disposition


  // eliminar archivo y la entrada de la BD
  // si las descargas son iguales a 1 -> borrar la entrada y borrar el archivo
  const { descargas, nombre } = enlace;
  if(descargas === 1) {

    // Eliminar el archivo
    req.archivo = nombre
    
    // Eliminar la entrada en la base de datos
    await Enlaces.findOneAndDelete( { nombre: nombre } );
    

    next()                     // este next lo que hace es pasar al siguiente controlador que esta definido en enlaces.js

  } else {
    enlace.descargas--;
    await enlace.save();    
  }
  
  

}
