var express = require('express');
var router = express.Router();
var { expressjwt: jwt } = require("express-jwt");
//var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ["HS256"]
});

require('../models/models');
require('../models/user');
var donanteCtrl = require('../controllers/donante');
//var servicioCtrl = require('../controllers/servicio');

var ctrlUser = require('../controllers/user');


/* paciente. */
router.get('/v1/pacientes/:servicioId',  auth,  donanteCtrl.findAll);
router.post('/v1/paciente/create/:servicioId', auth, donanteCtrl.createOne);
router.get('/v1/paciente/:id', auth, donanteCtrl.listOne);
//router.put('/v1/paciente/:pacienteId', auth, donanteCtrl.editOne);
router.delete('/v1/donante/:donanteId', auth, donanteCtrl.deleteOne);
//donacion
router.post('/v1/donacion/create/', auth, donanteCtrl.donacionCreateOne);
router.get('/v1/donacion/:donacionId', auth, donanteCtrl.getDonacionById);
router.put('/v1/donacion/:donanteId', auth, donanteCtrl.donacionEditOne);
router.post('/v1/donacion/check/', auth, donanteCtrl.donacionCheckOne);
router.post('/v1/donaciones/buscar/',  auth,  donanteCtrl.buscarDonaciones);
//router.post('/v1/donaciones/imprimir/',  auth,  donanteCtrl.imprimirDonaciones);
//buscarDonantes
router.get('/v1/donantes/buscar/:query',  auth,  donanteCtrl.buscarDonantes);
router.get('/v1/donante/:id', auth, donanteCtrl.listOne);
router.put('/v1/donante/:donanteId', auth, donanteCtrl.editOne);
/*user*/
router.post('/v1/register', ctrlUser.register);
router.post('/v1/register/integrante',  auth, ctrlUser.registerIntegrante);
router.post('/v1/login', ctrlUser.login);
router.post('/v1/recover', ctrlUser.recover);

/* opciones. */
router.get('/v1/opciones/get/:servicioId',  auth,  ctrlUser.getOpciones);
router.put('/v1/opciones/edit/:servicioId', auth, ctrlUser.editOpciones);
router.put('/v1/opciones/changepass/:userId', auth, ctrlUser.changePass);

//areglar donaciones
//router.get('/v1/donaciones/arreglar', auth, donanteCtrl.arreglarDonaciones);

module.exports = router;
