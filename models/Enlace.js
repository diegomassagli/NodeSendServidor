const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enlacesSchema = new Schema({
  url: { type: String, required: true},
  nombre: { type: String, required: true},
  nombre_original: { type: String, required: true},
  descargas: { type: Number, default: 1 },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', default: null},  // default null porque no todos los enlaces van a tener un usuario que los creo
  password: { type: String, default: null},
  creado: { type: Date, default: Date.now() }

})

module.exports = mongoose.model('Enlaces', enlacesSchema)