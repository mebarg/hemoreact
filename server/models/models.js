var mongoose = require('mongoose');
//var jwt = require('jsonwebtoken');
//var crypto = require('crypto');
const Schema = mongoose.Schema;


//borrar este schema despues de actualizar la base de datos
/* const donacion2Schema = Schema({
  servicioId:String,
  servicio:String,
  donanteId: String,
  donante:String,
  fecha: Date,
  numero:String,
  abo: String,
  rh: Boolean,
  serologia: String,
  sv:String
}); */

const donacionSchema = Schema({
  //_id: Schema.Types.ObjectId,
  servicioId:String,
  servicio:String,
  fecha: Date,
  numero:String,
  abo: {type:String, default:null},
  rh: {type:String,default:null},
  serologia:{type:String, default:null},
  sv:String,
  exclusionDefinitiva: {type:Boolean, default:false},
  exclusionTiempo:{type:Number, default:0},
  exclusionCodigo:String,
  autoexcluido: {type:Boolean, default:false},
  plasmaCovid: {type:Boolean, default:false},
});

var pacienteSchema = new mongoose.Schema({
  //_id: Schema.Types.ObjectId,
  apellido: String,
  nombre: String,
  dni: String,
  fechaNacimiento: Date,
  sexo: Boolean,
  domActual:String,
  localidadActual: String,
  domDni:String,
  localidadDni: String,
  telefono: String,
  codPostal: String,
  email: String,
  lugarNacimiento: String,
  ocupacion:String,
  convocado:String,
  donacionAferesis: Boolean,
  donacionAnterior:Boolean,
  esVoluntario: Boolean,
  donacion:[donacionSchema]
});


//mongoose.model('User', userSchema);
mongoose.model('pacienteModel', pacienteSchema);
//borrar este schema despues de actualizar la base de datos
//mongoose.model('donacionModel', donacion2Schema);
