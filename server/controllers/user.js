var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
//var nodemailer = require('nodemailer');

var sendJSONresponse = function(res, status, content) {
  //console.log('senjson ' + status);
  res.status(status);
  res.json(content);
};
module.exports.recover = function(req, res) {
  console.log("recover " + req.body.username);
  var id = null;
  User
    .findOne({
      username: req.body.username
    })
    //.select('nombre,telefono,direccion,email,ppl,remolcador,psicofisico,clubs')
    .exec(function(err, usr) {


      if (!usr) {
        console.log('usuario no encontrado');
        sendJSONresponse(res, 404, {
          msg: 'El usuario no existe'
        });

      } else if (err) {
        console.log('err ' + err);
        sendJSONresponse(res, 404, err);

      } else {
        console.log('usr ' + usr);
        if (usr.email == req.body.email) {


          //tenemos el email y corresponde

          //ponemos nueva pass
          var pass = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i = 0; i < 8; i++) {
            pass += possible.charAt(Math.floor(Math.random() * possible.length));
          }

          console.log('pass ' + pass);

          usr.setPassword(pass);

          usr.save(function(err, result) {
            if (err) {

              sendJSONresponse(res, 404, err);

            } else {
              //se guardo la nueva pass   la envio por email
              var transporter = nodemailer.createTransport({
                service: 'Godaddy',
                auth: {
                  user: 'hemoterapia_recover@medapps.com.ar',
                  pass: 'jwzDKLaAe4skTr4'
                }
              });

              var mailOptions = {
                from: 'hemoterapia_recover@medapps.com.ar',
                to: usr.email,
                subject: 'Reseteo de contraseña',
                html: '<h2>Reseteo de contraseña</h2><p>Ha solicitado el reseteo de su contraseña en el sistema de Hemotarapia.</p><p>Su nueva contraseña es <strong>' + pass + '</strong></p>'
              };


              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {

                  console.log('Email sent: ' + info.response);
                  sendJSONresponse(res, 200, {
                    "msg": "ok envio de email"
                  });

                }
              });


            }
          });





          /*  var mailOptions = {
          from: 'planeadores_recover@medapps.com.ar',
          to: usropt.email,
          subject: 'Reseteo de contraseña!!!',
          html: '<h2>Reseteo de contraseña</h2><p>Ha solicitado el reseteo de su contraseña en el sistema de Club de Planeadores.</p><p>Haga click <a href="www.planeadores.com.ar/resetpass">aqui</a> para resetear su contraseña</p><p>Si no ha solicitado el reseteo de su contraseña ignore este email.</p>'
        };
  */
        } else {
          console.log('email incorrecto ');
          sendJSONresponse(res, 404, {
            msg: 'El email no corresponde con el usuario'
          });
        }



      }
    });



};

module.exports.register = function(req, res) {
  console.log("rolll " + req.body.rol);
  console.log(req.body);
  //tenemoss que revisar si esta repetido el ussername
  var user = new User();

  user.username = req.body.username;
  user.name = req.body.name;
  user.rol = req.body.rol;

  user.telefono = req.body.telefono;
  user.email = req.body.email;

  user.setPassword(req.body.password);

  user.servicioId = '0';

  //if (req.body.rol == 1) {
  user.direccion = req.body.direccion;
  //  }else{
  //user.servicioId = req.body.servicioId;
  //    user.direccion = "";
  //  }
  console.log(" salvamos");
  user.save(function(err, usr) {
    console.log('id del usuario creado ' + usr._id);
    if (err) {
      console.log(" err reg" + err.code);
      if (err.code == "11000") {
        var error = "Usuario duplicado";
        sendJSONresponse(res, 404, error);
      } else {
        sendJSONresponse(res, 404, err);
      }
    } else {
      var token = user.generateJwt();
      sendJSONresponse(res, 200, {
        "token": token
      });
    }
  });
};
module.exports.registerIntegrante = function(req, res) {
  console.log("registerIntegrante rol " + req.body.rol);
  console.log(req.body);

  var user = new User();

  user.username = req.body.username;
  user.name = req.body.name;
  user.rol = req.body.rol;
  user.telefono = req.body.telefono;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.servicioId = req.body.servicioId;
  user.direccion = null;

  console.log(" salvamos");
  user.save(function(err, usr) {
    console.log('id del usuario creado ' + usr._id);
    if (err) {
      console.log(" err reg" + err.code);
      if (err.code == "11000") {
        var error = "Usuario duplicado";
        sendJSONresponse(res, 404, error);
      } else {
        sendJSONresponse(res, 404, err);
      }
    } else {

      sendJSONresponse(res, 200, usr);
    }
  });
};

module.exports.login = function(req, res) {
  if (!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }
  passport.authenticate('local', function(err, user, info) {


    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }
    if (user) {

      var token = user.generateJwt();

      sendJSONresponse(res, 200, {
        "token": token
      });

    } else {

      sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

module.exports.getOpciones = function(req, res) {
  //console.log(" servicioId "  +req.params.servicioId);
  if (req.params && req.params.servicioId) {
    //console.log('id ' );
    User
      .findById(req.params.servicioId)

      .exec(function(err, usr) {
        console.log('opciones ' + usr);

        if (!usr) {
          console.log('Configuración de usuario no encontrada');
          sendJSONresponse(res, 404, {
            msg: 'Configuración de usuario no encontrada'
          });

        } else if (err) {
          console.log('err ' + err);
          sendJSONresponse(res, 404, err);

        } else {
          //  console.log('usr ' + usr);

          var data = {
            name: usr.name,
            telefono: usr.telefono,
            direccion: usr.direccion,
            agradecimiento: usr.agradecimiento,
            email: usr.email,
            rol: usr.rol,
            servicioId: usr.servicioId,
            integrantes: []
          }
          User
            .find({
              servicioId: req.params.servicioId
            })

            .exec(function(err, integrantes) {
              console.log('integrantes ' + integrantes);

              if (!integrantes) {
                console.log('no hay integrantes');

              } else if (err) {
                console.log('err ' + err);

              } else {
                data.integrantes = integrantes;
              }

              sendJSONresponse(res, 200, data);



            });

          //  sendJSONresponse(res, 200, usr);


        }
      });

  }
};

module.exports.editOpciones = function(req, res) {
  console.log('user guardando en ' + req.body.servicioId);
  if (req.body.rol == 1) {
    User
      .findById(req.body.servicioId)
      .exec(function(err, options) {
        if (!options) {

          sendJSONresponse(res, 404, {
            msg: 'Usuario no encontrado'
          });
          return;
        } else if (err) {
          //console.log("err " + err);
          sendJSONresponse(res, 404, err);
          return;
        }

        options.name = req.body.name;
        options.telefono = req.body.telefono;
        options.direccion = req.body.direccion;
        options.email = req.body.email;
        options.agradecimiento = req.body.agradecimiento;



        options.save(function(err, result) {
          if (err) {

            sendJSONresponse(res, 404, err);

          } else {
            sendJSONresponse(res, 200, true);
          }
        });
      });
  } else {
    User
      .findOne({
        servicioId: req.body.servicioId
      })
      .exec(function(err, options) {
        if (!options) {

          sendJSONresponse(res, 404, {
            msg: 'Usuario no encontrado'
          });
          return;
        } else if (err) {
          //console.log("err " + err);
          sendJSONresponse(res, 404, err);
          return;
        }

        options.name = req.body.name;
        options.telefono = req.body.telefono;
        options.direccion = req.body.direccion;
        options.email = req.body.email;



        options.save(function(err, result) {
          if (err) {

            sendJSONresponse(res, 404, err);

          } else {
            sendJSONresponse(res, 200, true);
          }
        });
      });
  }


};

/*
module.exports.asociarClub = function(req, res) {
  console.log('asociando club ' + req.body.nombre);
  var username;
  userOpt
  .findOne({
    userId: req.body.userId
  })
  .exec(function(err, options) {
    if (!options) {

      sendJSONresponse(res, 404, {
        msg: 'Usuario no encontrado'
      });
      return;
    } else if (err) {
      console.log("err " + err);
      sendJSONresponse(res, 404, err);
      return;
    }
    username = options.nombre;
    for (var i = 0; i < options.clubs.length; i++) {
      if (req.body.clubId == options.clubs[i].clubId) {
        console.log("ya asociado");
        sendJSONresponse(res, 404, {
          msg: 'Ya esta asociado a ese club'
        });
        console.log("no aca22");
        return;
      }
    }
    console.log("no aca");

    var clu = {
      nombre: req.body.nombre,
      clubId: req.body.clubId,
      status: req.body.status
    };

    options.clubs.push(clu);


    options.save(function(err, result) {});

    clubOpt
    .findOne({
      userId: req.body.clubId
    })
    .exec(function(err, options2) {
      if (!options2) {

        sendJSONresponse(res, 404, {
          msg: 'club no encontrado'
        });
        return;
      } else if (err) {
        console.log("err " + err);
        sendJSONresponse(res, 404, err);
        return;
      }



      var userr = {
        nombre: username,
        userId: req.body.userId,

      };

      options2.pendientes.push(userr);


      options2.save(function(err, result) {});

      sendJSONresponse(res, 200, "ok");
    });
  });
  //ahora lo pongo en la lista de pendientes del club

  //  sendJSONresponse(res, 200, "ok");

};

*/

module.exports.changePass = function(req, res) {
  console.log('changePass ' + req.body.original);
  console.log('changePass2 ' + req.params.userId);



  User.findById(req.params.userId, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user.validPassword(req.body.original)) {
      sendJSONresponse(res, 404, {
        msg: "Password incorrecta"
      });
    } else {
      user.setPassword(req.body.nueva1);


      user.save(function(err, result) {
        if (err) {
          sendJSONresponse(res, 404, err);
        } else {
          sendJSONresponse(res, 200, {
            msg: "Cambio de password ok"
          });
        }
      });
    }

  });





};
/*
module.exports.autorizarPendiente = function(req, res) {
var username;
if (req.body.userId) {
userOpt
.findOne({
userId: req.body.userId
})
.exec(function(err, options) {
if (!options) {

sendJSONresponse(res, 404, {
msg: 'Usuario no encontrado'
});
return;
} else if (err) {
console.log("err " + err);
sendJSONresponse(res, 404, err);
return;
}
username = options.nombre;
for (var i = 0; i < options.clubs.length; i++) {
if (req.body.clubId == options.clubs[i].clubId) {
options.clubs[i].status = "Aprobado";
}
}

options.save(function(err, result) {});

//lo borramos de pendientes y lo ponemos en socios
clubOpt
.findOne({
userId: req.body.clubId
})
.exec(function(err, options2) {
if (!options2) {

sendJSONresponse(res, 404, {
msg: 'club no encontrado'
});
return;
} else if (err) {
console.log("err " + err);
sendJSONresponse(res, 404, err);
return;
}


for (var i = 0; i < options2.pendientes.length; i++) {
if (req.body.userId == options2.pendientes[i].userId) {

console.log('borrando ' + i);
options2.pendientes.splice(i, 1);
}
}
var soc = {
userId: req.body.userId,
nombre: username
};
options2.socios.push(soc);
options2.save(function(err, result) {
sendJSONresponse(res, 200, soc);
});


});


});


} else {
sendJsonResponse(res, 404, {
msg: 'no hay id en req'
});
}


};
*/
///////////////////////////////////
//antoguos a modificar
//////////////////////



/*

module.exports.getConfig = function(req, res) {

if (req.params && req.params.userId) {
User
.findById(req.params.userId)
.select('nombre,telefono,direccion,email,ppl,remolcador,psicofisico,clubs')
.exec(function(err, usr) {


if (!usr) {
sendJSONresponse(res, 404, {
msg: 'Configuración de usuario no encontrada'
});

} else if (err) {
sendJSONresponse(res, 404, err);

} else {


sendJSONresponse(res, 200, usr);


}
});

}
};

module.exports.setConfig = function(req, res) {

User
.findById(req.body.userId)
.exec(function(err, usr) {
if (!usr) {

sendJSONresponse(res, 404, {
msg: 'Usuario no encontrado'
});
return;
} else if (err) {
console.log("err");
sendJSONresponse(res, 404, err);
return;
}

usr.config = JSON.stringify(req.body.config);

usr.save(function(err, result) {
if (err) {

sendJSONresponse(res, 404, err);

} else {
sendJSONresponse(res, 200, true);
}
});
});

};
*/
