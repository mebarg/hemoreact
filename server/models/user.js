var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  servicioId: String,
  direccion: String,
  telefono: String,
  email: String,
  rol:String,
  hash: String,
  salt: String,
  agradecimiento: {
    type: String,
    default: null,
  },
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');

  return this.hash === hash;

};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  var servicioId;
  if (this.rol == 1) {
    servicioId = this._id;
  } else {
    servicioId = this.servicioId;
  }
  return jwt.sign({
    userId: this._id,
    username: this.username,
    name:this.name,
    servicioId: servicioId,
    rol: this.rol,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET);
};
mongoose.model('User', userSchema);
