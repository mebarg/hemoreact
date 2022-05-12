var mongoose = require('mongoose');
var pac = mongoose.model('pacienteModel');

var don = mongoose.model('donacionModel'); //borrar
var qpm = require('query-params-mongo');





        module.exports.findAll = function(req, res) {
            //{userId:req.query.id}
            pac
                .find({
                    servicioId: req.params.servicioId,
                })
                .exec(function(err, data) {

                    if (!data) {
                        sendJsonResponse(res, 404, {
                            msg: 'datos no encontradosssss'
                        });

                    } else if (err) {
                        sendJsonResponse(res, 404, err);

                    } else {
                        sendJsonResponse(res, 200, data);
                    }
                });



        };




        /*module.exports.donacionCreateOne = function(req, res) {
          console.log("donacionCreateOne");
          if (req.body.servicioId) {
            console.log(" buscando donacion " + req.body.numero);
            don
              .findOne({
                //  donanteId: req.params.donanteId,
                //  fecha:req.body.fecha,
                donanteId: req.body.donanteId,
                servicioId: req.body.servicioId,
                numero: req.body.numero,
                //    donanteId: req.body.donanteId
              })

              .exec(function(err, datos) {
                if (err) {
                  console.log('error buscando donacion');
                  sendJsonResponse(res, 404, err);

                } else if (datos) {
                  console.log('ya existe la donacion');
                  sendJsonResponse(res, 404, {
                    msg: "La donación ya existe"
                  });
                  return;

                }
                console.log('no existe la onacion  guardamos');

                don.create({

                  servicioId: req.body.servicioId,
                  donanteId: req.body.donanteId,
                  fecha: req.body.fecha,
                  numero: req.body.numero,
                  donante: req.body.donante,
                  servicio: req.body.servicio

                }, function(err, vue) {
                  if (err) {
                    console.log("err");
                    console.log(err);
                    sendJsonResponse(res, 404, err);
                  } else {
                    console.log('se guardo ' + vue);
                    sendJsonResponse(res, 201, vue);
                  }
                });

              });
          } else {
            console.log("ACA");
            sendJsonResponse(res, 404, {
              msg: 'no hay id en req'
            });
          }
        };*/

        /*module.exports.donacionCheckOne = function(req, res) {

          don
            .findOne({

              donanteId: req.body.donanteId,
              //servicioId: req.body.servicioId,
              fecha: {"$gte": new Date( req.body.fecha + "T00:00:00.000Z"), "$lt": new Date( req.body.fecha + "T23:59:59.000Z")}

            })

            .exec(function(err, datos) {
              if (err) {
                console.log('error buscando donacion');
                sendJsonResponse(res, 404, err);

              } else if (datos) {
                console.log('ya existe la donacion');
                sendJsonResponse(res, 200, datos.numero);
                return;

              }
              console.log('no existe la donacion ');
              sendJsonResponse(res, 200, false);
              //return;


            });

        };*/



        /*module.exports.donacionListOne = function(req, res) {
          if (req.params && req.params.id) {
            console.log(" buscando id " + req.params.id);
            don
              .findById(req.params.id)

              .exec(function(err, datos) {
                //console.log(JSON.stringify(datos));
                if (!datos) {
                  sendJsonResponse(res, 404, {
                    msg: 'No encontrado'
                  });

                } else if (err) {
                  sendJsonResponse(res, 404, err);

                } else {
                  sendJsonResponse(res, 200, datos);


                }
              });
          } else {
            sendJsonResponse(res, 404, {
              msg: 'no hay id en req'
            });
          }
        };*/



        /*module.exports.donacionEditOne = function(req, res) {
          if (!req.params.donacionId) {
            sendJsonResponse(res, 404, {
              msg: 'no hay id en req'
            });
            return;
          } else {
            don
              .findById(req.params.donacionId)

              .exec(function(err, donacion) {
                if (!donacion) {
                  sendJsonResponse(res, 404, {
                    msg: 'Paciente no encontrado'
                  });
                  return;
                } else if (err) {

                  sendJsonResponse(res, 404, err);
                  return;
                } else {



                  donacion.abo = req.body.abo;
                  donacion.rh = req.body.rh;
                  donacion.serologia = req.body.serologia;

                  donacion.save(function(err, noved) {
                    if (err) {

                      sendJsonResponse(res, 404, err);
                    } else {

                      sendJsonResponse(res, 200, noved);
                    }
                  });

                }
              });
          }
        };*/

        /*module.exports.donacionDeleteOne = function(req, res) {

          if (req.params.donacionId) {
            don
              .findByIdAndRemove(req.params.donacionId)
              .exec(function(err, noved) {
                if (err) {
                  sendJsonResponse(res, 404, err);
                } else {

                  sendJsonResponse(res, 204, null);
                }
              });
          } else {
            sendJsonResponse(res, 404, {
              msg: 'no hay id en req'
            });
          }
        };*/

        //respuesta
        var sendJsonResponse = function(res, status, content) {
            res.status(status);
            res.json(content);
        };