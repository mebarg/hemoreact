var mongoose = require('mongoose');
var pac = mongoose.model('pacienteModel');
var qpm = require('query-params-mongo');

//var don = mongoose.model('donacionModel'); //borrar


/*module.exports.arreglarDonaciones = function(req, res) {
console.log("arreglando donaciones");
var dona;

don
.find()
.exec(function(err, donaciones) {

    if (!donaciones) {
        sendJsonResponse(res, 404, {
            msg: 'No hay donaciones.'
        });

    } else if (err) {
        sendJsonResponse(res, 404, err);

    } else {
        dona = donaciones;
        //buscamos todos los donantrs
        // recorremos la lista de donantes con un for y en cada uno recorremos la ista de donaciones

        //si encontrams una donacion para el donante de l agregamos

        pac
            .find()

        .exec(function(err, donantes) {

                if (!donantes) {
                    sendJsonResponse(res, 404, {
                        msg: 'No hay donantes.'
                    });

                } else if (err) {
                    sendJsonResponse(res, 404, err);

                } else {
                  console.log("n donantes " + donantes.length )

                    for (var d = 0; d < donantes.length; d++) {


                        for (var i = 0; i < dona.length; i++) {
                            if (donantes[d]._id == dona[i].donanteId) {
 console.log("paciente " + donantes[d]._id + " la donacion del " + dona[i].fecha);
                                    donantes[d].donacion.push({
                                        servicioId: dona[i].servicioId,
                                        fecha: dona[i].fecha,
                                        numero: dona[i].numero,
                                        sv: dona[i].sv,
                                        servicio: dona[i].servicio,
                                        abo: dona[i].abo,
                                        rh: dona[i].rh,
                                        serologia: dona[i].serologia,
                                    })

                                      donantes[d].save(function(err, resp) {
                                        if (err) {
 console.log("err "  + err)
                                //sendJsonResponse(res, 404, err);
                            } else {

                                //sendJsonResponse(res, 200, resp);
                            }
                                        console.log("salvado " )
                                      });

                                }
                            }


                        }

                       /* donantes.save(function(err, resp) {
                            if (err) {

                                sendJsonResponse(res, 404, err);
                            } else {

                                sendJsonResponse(res, 200, resp);
                            }
                        });*/


/*
                    }
                });



        }
    });


};
*/

module.exports.buscarDonantes = function(req, res) {

  var q;
  if (req.query.all == "all") {
    pac
      .find({
        servicioId: req.params.id,

      })

      .exec(function(err, data) {

        if (!data) {
          sendJsonResponse(res, 404, {
            msg: 'No hay donantes.'
          });

        } else if (err) {
          sendJsonResponse(res, 404, err);

        } else {
          sendJsonResponse(res, 200, data);
        }
      });


  } else {
    var processQuery = qpm();
    var query = processQuery(req.query);
  //  console.log(" filter  " + JSON.stringify(query.filter));
    //q = query.filter;
    pac
      .find(query.filter)
      .sort(query.sort)
      .limit(query.limit)
      .exec(function(err, donantes) {

        if (!donantes) {
          sendJsonResponse(res, 404, {
            msg: 'No hay Donantes.'
          });

        } else if (err) {
          sendJsonResponse(res, 404, err);

        } else {
          sendJsonResponse(res, 200, donantes);
        }
      });
  }

};




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




module.exports.createOne = function(req, res) {
  //console.log("createOne");
  if (req.params.servicioId) {
   // console.log(" buscando paciente " + req.body.dni);
    pac
      .findOne({
        //  servicioId: req.params.servicioId,
        dni: req.body.dni
      })

      .exec(function(err, datos) {
        if (err) {
          sendJsonResponse(res, 404, err);

        } else if (datos) {
          sendJsonResponse(res, 404, {
            msg: "El paciente ya existe"
          });
          return;

        }


        pac.create({

          //    servicioId:req.params.servicioId,
          apellido: req.body.apellido,
          nombre: req.body.nombre,
          dni: req.body.dni,
          fechaNacimiento: req.body.fechaNacimiento,
          sexo: req.body.sexo,
          domActual: req.body.domActual,
          localidadActual: req.body.localidadActual,
          domDni: req.body.domDni,
          localidadDni: req.body.localidadDni,
          telefono: req.body.telefono,
          codPostal: req.body.codPostal,
          email: req.body.email,
          lugarNacimiento: req.body.lugarNacimiento,
          ocupacion: req.body.ocupacion,
          convocado: req.body.convocado,
          donacionAferesis: req.body.donacionAferesis,
          donacionAnterior: req.body.donacionAnterior,
          esVoluntario: req.body.esVoluntario,


        }, function(err, vue) {
          if (err) {
         //   console.log("err");
        //    console.log(err);
            sendJsonResponse(res, 404, err);
          } else {
        //    console.log('se guardo ' + vue);
            sendJsonResponse(res, 201, vue);
          }
        });

      });
  } else {
    //console.log("ACA");
    sendJsonResponse(res, 404, {
      msg: 'no hay id en req'
    });
  }
};




module.exports.listOne = function(req, res) {
  if (req.params && req.params.id) {
    console.log(" buscando id " + req.params.id);
    pac
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
};



module.exports.editOne = function(req, res) {
  if (!req.params.donanteId) {
    sendJsonResponse(res, 404, {
      msg: 'no hay id en req'
    });
    return;
  } else {
    pac
      .findById(req.params.donanteId)

      .exec(function(err, donante) {
        if (!donante) {
          sendJsonResponse(res, 404, {
            msg: 'Donante no encontrado'
          });
          return;
        } else if (err) {

          sendJsonResponse(res, 404, err);
          return;
        } else {



          donante.apellido = req.body.apellido;
          donante.nombre = req.body.nombre;
          donante.dni = req.body.dni;
          donante.fechaNacimiento = req.body.fechaNacimiento;
          donante.sexo = req.body.sexo;
          donante.domActual = req.body.domActual;
          donante.localidadActual = req.body.localidadActual;
          donante.domDni = req.body.domDni;
          donante.localidadDni = req.body.localidadDni;
          donante.telefono = req.body.telefono;
          donante.codPostal = req.body.codPostal;
          donante.email = req.body.email;
          donante.lugarNacimiento = req.body.lugarNacimiento;
          donante.ocupacion = req.body.ocupacion;
          donante.convocado = req.body.convocado;
          donante.donacionAferesis = req.body.donacionAferesis;
          donante.donacionAnterior = req.body.donacionAnterior;
          donante.esVoluntario = req.body.esVoluntario;



          donante.save(function(err, resp) {
            if (err) {

              sendJsonResponse(res, 404, err);
            } else {

              sendJsonResponse(res, 200, resp);
            }
          });

        }
      });
  }
};
module.exports.donacionEditOne = function(req, res) {
  if (!req.params.donanteId) {
    sendJsonResponse(res, 404, {
      msg: 'no hay id en req'
    });
    return;
  } else {
    pac
      .findById(req.params.donanteId)

      .exec(function(err, donante) {
        if (!donante) {
          sendJsonResponse(res, 404, {
            msg: 'Donante no encontrado'
          });
          return;
        } else if (err) {

          sendJsonResponse(res, 404, err);
          return;
        } else {



          var donacion = donante.donacion.id(req.body.donacionId);
          donacion.serologia = req.body.serologia;
          donacion.abo = req.body.abo;
          donacion.rh = req.body.rh;
if(req.body.exclusion=="1"){
donacion.exclusionDefinitiva=true;
donacion.exclusionCodigo=req.body.exclusionCodigo;
}else if (req.body.exclusion=="2"){
  donacion.exclusionDefinitiva=false;
  donacion.exclusionTiempo=req.body.exclusionTiempo;
  donacion.exclusionCodigo=req.body.exclusionCodigo;

}

          donante.save(function(err, resp) {
            if (err) {

              sendJsonResponse(res, 404, err);
            } else {

              sendJsonResponse(res, 200, resp);
            }
          });

        }
      });
  }
};
module.exports.deleteOne = function(req, res) {

  if (req.params.donanteId) {
    pac
      .findByIdAndRemove(req.params.donanteId)
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
};


module.exports.donacionCreateOne = function(req, res) {
 // console.log("donacionCreateOne");
  if (req.body.servicioId) {
    //console.log(" buscando donacion " + req.body.numero);
    pac
      //  .find({_id:req.body.donanteId,
      //    "donacion.numero":req.body.numero})
      .findById(req.body.donanteId)
      .exec(function(err, donante) {
      //  console.log('donante');
      //  console.log(JSON.stringify(donante));
        if (err) {
       //   console.log('error buscando donacion');
          sendJsonResponse(res, 404, err);

        }
        /* else if (donante) {
                  console.log('ya existe la donacion');
                  sendJsonResponse(res, 404, {
                    msg: "La donación ya existe"
                  });
                  return;

                }*/


        for (var i = 0; i < donante.donacion.length; i++) {
          if (donante.donacion[i].numero == req.body.numero) {
        //    console.log('ya existe la donacion');
            sendJsonResponse(res, 404, {
              msg: "La donación ya existe"
            });
            return;
          }
        }
    //    console.log('no existe la donacion  guardamos');

        donante.donacion.push({
          servicioId: req.body.servicioId,
         // fecha: new Date(),
          fecha:req.body.fecha,
          numero: req.body.numero,
          sv: req.body.sv,
          servicio: req.body.servicio,
          plasmaCovid:req.body.plasmaCovid
          //serologia: null
        })

        donante.save(function(err, resp) {
          if (err) {

            sendJsonResponse(res, 404, err);
          } else {

            sendJsonResponse(res, 200, resp);
          }
        });

      });
  } else {
   // console.log("ACA");
    sendJsonResponse(res, 404, {
      msg: 'no hay id en req'
    });
  }
};


module.exports.donacionCheckOne = function(req, res) {


  pac
    .findOne({

      _id: req.body.donanteId,

      'donacion.fecha': {
        "$gte": new Date(req.body.fecha + "T00:00:00.000Z"),
        "$lt": new Date(req.body.fecha + "T23:59:59.000Z")
      }

    })

    .exec(function(err, datos) {
     // console.log('checkdonacion');
      console.log(JSON.stringify(datos));
      if (err) {
      //  console.log('error buscando donacion22');
        sendJsonResponse(res, 404, err);

      } else if (datos) {
     //   console.log('ya existe la donacion22');
        sendJsonResponse(res, 200, datos.donacion[0].numero);
        return;

      }
    //  console.log('no existe la donacion 22');
      sendJsonResponse(res, 200, false);
      //return;


    });

};

module.exports.buscarDonaciones = function(req, res) {
  console.log('buscarDonaciones');
  console.log(req.body.fecha);
  console.log(req.body.numero);
  var query;
  if (req.body.numero && req.body.fecha) {
    query = {
      "donacion.numero": req.body.numero,
      "donacion.fecha": {
        "$gte": new Date(req.body.fecha + "T00:00:00.000Z"),
        "$lt": new Date(req.body.fecha + "T23:59:59.000Z")
      }
    }
  } else if (req.body.numero) {
    query = {
      "donacion.numero": req.body.numero
    }
  } else if (req.body.fecha) {
    query = {
      "donacion.fecha": {
        "$gte": new Date(req.body.fecha + "T00:00:00.000Z"),
        "$lt": new Date(req.body.fecha + "T23:59:59.000Z")
      }
    }
  }

 // console.log(JSON.stringify(query));

  pac.aggregate([

    {
      "$unwind": "$donacion"
    },
     {
      "$match": query
    },

    {
      "$project": {

        "donacionId": "$donacion._id",
        "nombre": "$nombre",
        "apellido": "$apellido",
        "fechaNacimiento": "$fechaNacimiento",
        "lugarNacimiento": "$lugarNacimiento",
        "sexo": "$sexo",
        "domActual": "$domActual",
        "telefono": "$telefono",
        "dni": "$dni",
        "numero": "$donacion.numero",
        "fecha": "$donacion.fecha",
        "servicio": "$donacion.servicio",
        "sv": "$donacion.sv",
        "serologia": "$donacion.serologia",
        "abo": "$donacion.abo",
        "rh": "$donacion.rh",
        "plasmaCovid":"$donacion.plasmaCovid",
        "exclusionDefinitiva":"$donacion.exclusionDefinitiva",
        "exclusionTiempo":"$donacion.exclusionTiempo",
        "exclusionCodigo":"$donacion.exclusionCodigo",
      }
    },{
      "$sort":{fecha:1}
    }
  ], function(err, result) {









   console.log('result');
    console.log(JSON.stringify(result));
    sendJsonResponse(res, 200, result);
  });





};
module.exports.getDonacionById = function(req, res) {
  console.log('getDonacionById');
  console.log(req.params.donacionId);
  
  var  query = {
      "donacion._id": new mongoose.Types.ObjectId(req.params.donacionId)
    }

  console.log(JSON.stringify(query));

  pac.aggregate([
    {
      "$unwind": "$donacion"
    },
     {
      "$match": query
    },
    {
      "$project": {

        "donacionId": "$donacion._id",
        "nombre": "$nombre",
        "apellido": "$apellido",
        "fechaNacimiento": "$fechaNacimiento",
        "lugarNacimiento": "$lugarNacimiento",
        "sexo": "$sexo",
        "domActual": "$domActual",
        "telefono": "$telefono",
        "dni": "$dni",
        "numero": "$donacion.numero",
        "fecha": "$donacion.fecha",
        "servicio": "$donacion.servicio",
        "sv": "$donacion.sv",
        "serologia": "$donacion.serologia",
        "abo": "$donacion.abo",
        "rh": "$donacion.rh",
        "plasmaCovid":"$donacion.plasmaCovid",
        "exclusionDefinitiva":"$donacion.exclusionDefinitiva",
        "exclusionTiempo":"$donacion.exclusionTiempo",
        "exclusionCodigo":"$donacion.exclusionCodigo",
      }
    }
  ], function(err, result) {
   console.log('result');
    console.log(JSON.stringify(result));
    sendJsonResponse(res, 200, result);
  });

};




//respuesta
var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};
