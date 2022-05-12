var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('useUnifiedTopology', true);
//mongoose.set('useCreateIndex', true);

dbURI = process.env.dbURI;


module.exports = {
    connectToServer: function () {
        mongoose.connect(dbURI,{ useNewUrlParser: true });

        //eventos para loguear mongoose
        mongoose.connection.on('connected', function(){
           console.log('mongoose conectado a ' + dbURI);
        
        });
        mongoose.connection.on('error', function(err){
           console.log('mongoose error ' + err);
        });
        mongoose.connection.on('disconnected', function(){
           console.log('mongoose desconectado');
        });
        
        
        //cerramos la conecccion
        
        //cierre iniciado por nodemon
        process.once('SIGUSR2', function (){
            cerrarBien('reinicio de nodemon', function(){
                process.kill(process.pid, 'SIGUSR2');
            });
        });
        //fin de la app
        process.once('SIGINT', function (){
            cerrarBien('fin de la app', function(){
                process.exit(0);
            });
        });
        //fin por heroku
        process.once('SIGTERM', function (){
            cerrarBien('fin de la app por HEROKU', function(){
               process.exit(0);
            });
        });
        
        var cerrarBien = function(msg, callback){
            mongoose.connection.close(function(){
                console.log('Mongoose cerrado por '+ msg);
                callback();
            });
        };;
       
    },
   
   
}



