var datos = require("./datos.js");
var expedientes = datos.expedientes;

var http = require("http");
var httpServer = http.createServer();

var WebSocketServer = require("websocket").server;
var wsServer = new WebSocketServer({
    httpServer : httpServer
});

var puerto = 4444;
httpServer.listen(puerto, function(){
    console.log("Servidor de WebSocket iniciado en el puerto: ", puerto);
});

var clientes = [];

wsServer.on("request", function(request){
    var conexion = request.accept("clientes", request.origin);
    var cliente = { conexion: conexion };
    clientes.push(cliente);
    console.log("Cliente conectado. Ahora hay", clientes.length);

    conexion.on("message", function(message){
        if(message.type === "utf8"){
            var msg = JSON.parse(message.utf8Data);

            // IDENTIFICAMOS Map
            if(msg.origen == "texto_map"){   
                cliente.id = msg.idMed;
                cliente.origen = "map";
                cliente.idExpediente = msg.idExpediente;
            }
            // IDENTIFICAMOS ME
            if(msg.origen == "texto_me"){   
                cliente.id = msg.me;
                cliente.origen = "me";
                cliente.idExpediente = msg.idExpediente;
            }

            // -------------- MAP -------------------
            // Mensaje del map --> me
            if (msg.origen == "texto_map"){
                var comprobar = false;
                var nombremap = msg.map; 
                var texto = msg.texto;
                var fecha = msg.fecha;
                var idExpediente = msg.idExpediente;

                for (var i = 0; i < clientes.length; i++){
                    if (clientes[i].origen == "me" && clientes[i].idExpediente == idExpediente && clientes[i] !== cliente && expedientes.me == msg.id){
                        clientes[i].conexion.sendUTF(JSON.stringify({origen: "texto_map", texto: texto, fecha: fecha, map: nombremap}));
                        comprobar = true;
                    }
                }
                if (comprobar == false){
                    conexion.sendUTF(JSON.stringify({comprobamos: "error", mensaje: "No hay ningún ME conectado para el expediente"}));
                }
            }

            // -------------- ME -------------------
            // mensaje del me --> map
            if (msg.origen == "texto_me"){
                var comprobar = false;
                var nombreme = msg.me; 
                var texto = msg.texto;
                var fecha = msg.fecha;
                var idExpediente = msg.idExpediente;

                for (var i = 0; i < clientes.length; i++){
                    if (clientes[i].origen == "map" && clientes[i].idExpediente == idExpediente && clientes[i] !== cliente){
                        clientes[i].conexion.sendUTF(JSON.stringify({origen: "texto_me", texto: texto, fecha: fecha, me: nombreme}));
                        comprobar = true;
                    }
                }
                if (comprobar == false){
                    conexion.sendUTF(JSON.stringify({comprobamos: "error", mensaje: "No hay ningún ME conectado para el expediente"}));
                }
            }
        }
    });

    conexion.on('close', function(){
        var index = clientes.indexOf(cliente);
        if (index > -1) {
            clientes.splice(index, 1);
        }
        console.log("Cliente desconectado. Ahora hay " + clientes.length);
    });
});
