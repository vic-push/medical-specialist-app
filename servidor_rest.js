// Importa el módulo Express, que es un marco de aplicación web para Node.js
var express = require("express");

// Crea una nueva aplicación Express
var app = express();

// Importa el módulo 'datos.js', que suponemos que exporta algunos datos que se utilizarán en la aplicación
let datos = require('./datos.js');

// Esta línea está comentada, pero si se descomenta, imprimirá los datos importados y la cadena 'the json obj' en la consola
//console.log(datos, 'the json obj');

// Configura la aplicación para servir los archivos estáticos en la carpeta '../MAP' cuando se solicite la ruta '/apiMAP'
app.use("/map", express.static("../MAP")); //express.static hace referencia a la carpeta médico de atención primaria

// Configura la aplicación para servir los archivos estáticos en la carpeta '../ME' cuando se solicite la ruta '/apiME'
app.use("/me", express.static("../ME")); //express.static hace referencia a la carpeta médico especialista

// Configura la aplicación para usar el middleware 'express.json()', que analiza las solicitudes con cuerpos JSON
app.use(express.json());





//?---------------------------------------------------------------------------------------
//? RECOGEMOS DATOS DE LOS ARRAY

// Extrae la propiedad 'especialidades' del objeto 'datos' y la asigna a la variable 'especialidades'
var especialidades = datos.especialidades;

// Extrae la propiedad 'centros' del objeto 'datos' y la asigna a la variable 'centros'
var centros = datos.centros;

// Extrae la propiedad 'medicos' del objeto 'datos' y la asigna a la variable 'medicos'
var medicos = datos.medicos;

// Extrae la propiedad 'expedientes' del objeto 'datos' y la asigna a la variable 'expedientes'
var expedientes = datos.expedientes;

// Extrae la propiedad 'id_nuevo_Medico' del objeto 'datos' y la asigna a la variable 'id_nuevo_Medico'
var id_nuevo_Medico = datos.id_nuevo_Medico;

// Extrae la propiedad 'id_nuevo_Expediente' del objeto 'datos' y la asigna a la variable 'id_nuevo_Expediente'
var id_nuevo_Expediente = datos.id_nuevo_Expediente;




//?---------------------------------------------------------------------------------------
//? MÉTODDOS REST DEL SERVIDOR



//?---------------------------------------------------------------------------------------
//* ESPECIALIDADES (Obtiene un array con todas las especialidades)

// Define una ruta GET para "/api/especialidades"
app.get("/api/especialidades", function(req, res) {
    // Cuando se recibe una solicitud a esta ruta, se llama a esta función de devolución de llamada con el objeto de solicitud (req) y el objeto de respuesta (res) como argumentos

    // Establece el estado de la respuesta HTTP en 200 (OK)
    res.status(200).json(especialidades); // Envía la respuesta con el contenido de la variable 'especialidades' en formato JSON
});



//?---------------------------------------------------------------------------------------
//* CENTROS (Obtiene un array con todos los centros)

// Define una ruta GET para "/api/centros"
app.get("/api/centros", function(req, res) {
    // Cuando se recibe una solicitud a esta ruta, se llama a esta función de devolución de llamada con el objeto de solicitud (req) y el objeto de respuesta (res) como argumentos

    // Establece el estado de la respuesta HTTP en 200 (OK)
    res.status(200).json(centros); // Envía la respuesta con el contenido de la variable 'centros' en formato JSON
});

//?---------------------------------------------------------------------------------------
//* LOGIN DEL MEDICO
// Realiza un login para el medico
app.post("/api/medico/login", function(req,res){
    // Creamos Array con los valores login y password introducimos y los introducimos en un body
    var datosMed = {
        login : req.body.login,
        password : req.body.password
    };
     // Creamos un bucle FOR para recorrer todos los medicos del ARRAY creado en datos (datos.medicos)
    for (var i = 0; i < medicos.length; i++){ // va recorriendo los medicos
        var idMed = medicos[i].id; //Obtenemos el id del medico  actual y la guardamos en una variable que exportaremos en el status 201
        // Si coincide el login y password del medico con los introducidos entra en el IF
        if (medicos[i].login == datosMed.login && medicos[i].password == datosMed.password && medicos[i].especialidad == 0) {
            res.status(201).json(idMed);// NOS DEVUELVE EL ID DEL MEDICO
            // y solo de ese medico q le hemos pasado usuario y contraseña
        }
        else if (medicos[i].login == datosMed.login && medicos[i].password == datosMed.password && medicos[i].especialidad != 0){
            res.status(403).json("Es usted médico especialista, entre desde su portal");
        }
    }
    res.status(403).json("No existe el médico");
});

//?---------------------------------------------------------------------------------------
//* DATOS MEDICO
// Obtiene los datos del médico sin devolver la contraseña 
app.get("/api/medico/:id", function (req, res){
    var datosMed = {}; 
    var idMed = req.params.id;
    for (var i=0; i<medicos.length; i++){
        if (medicos[i].id == idMed){
            datosMed["id"] = medicos[i].id;
            datosMed["nombre"] = medicos[i].nombre;
            datosMed["apellidos"] = medicos[i].apellidos;
            datosMed["login"] = medicos[i].login;
            datosMed["especialidad"] = medicos[i].especialidad;
            datosMed["centro"] = medicos[i].centro;
            res.status(200).json(datosMed);
        }
    }
    
   res.status(404).json("No existe médico");
});    

//?---------------------------------------------------------------------------------------
//* CREAR NUEVO MEDICO
//En principio esto funciona, lo unico es que el nuevo medico no se guarda en medicos de datos.js
app.post("/api/medico", function (req, res){
    var nuevoMedico = {
        id: id_nuevo_Medico,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        login: req.body.login,
        password: req.body.password,
        especialidad: 0,
        centro: req.body.centro
    };
    // Recorremos la lista de medicos 
    for (var i in medicos){
        // Verificamos si el nombre asociado al login ya existe
        if (medicos[i].login == nuevoMedico.login) {
            res.status(404).json ("El usuario de acceso ya pertenece a otro paciente");
        }
    // Verificamos si faltan datos por ingresar en la solicitud
    if (nuevoMedico.nombre == "" || nuevoMedico.apellidos == "" || nuevoMedico.login == "" || nuevoMedico.password == "" || nuevoMedico.centro == "" || nuevoMedico.centro == "0" ){
        res.status(404).json ("Faltan datos por ingresar");
    }
    else{
        console.log(nuevoMedico)
        medicos.push(nuevoMedico); // Se añade el nuevo paciente a la lista creada de pacientes
        id_nuevo_Medico++; // Cada vez que se crea paciente sumamos uno al valor del id para que cada paciente tenga id único
        res.status(201).json("Nuevo medico listado") // Creamos mensaje de confirmación
        console.log(medicos)
    }
    }
});

//?---------------------------------------------------------------------------------------
//* ACTUALIZAR DATOS MEDICO
//Esta función actualiza el medico con id que esta entrando
app.put("/api/medico/:id", function (req, res){
    var idMed = req.params.id;
    var datosMed = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        login: req.body.login,
        password: req.body.password,
        centro: req.body.centro
    }
    for (var i = 0; i < medicos.length; i++){
        if (medicos[i].id == idMed){
            for (var j = 0; j < medicos.length; j++){
                if (medicos[j].login == datosMed.login && j != i){
                    return res.status(400).json("El login ya está en uso");
                }
            }
            // Comprobar que ninguno de los campos esté vacío
            if (datosMed.nombre == "" || datosMed.apellidos == "" || datosMed.login == "" || datosMed.password == "" || datosMed.centro == ""){
                return res.status(400).json("Ninguno de los campos puede estar vacío");
            }
            medicos[i].nombre = datosMed.nombre;
            medicos[i].apellidos = datosMed.apellidos;
            medicos[i].login = datosMed.login;
            medicos[i].password = datosMed.password;
            medicos[i].especialidad = 0;
            medicos[i].centro = datosMed.centro;
            res.status(200).json("Datos actualizados");
            console.log(medicos[i])
        }
    }
    res.status(404).json("No existe el médico");
});

//?---------------------------------------------------------------------------------------
//* OBTENER EXPEDIENTES
// Obtiene todos los expedientes creados por un medico de atenciòn primaria (en concreto quien lo consulta)
app.get("/api/map/:id/expedientes", function(req, res){
    var idMed = req.params.id;
    var expedientesMed = [];
    for (var i = 0; i < expedientes.length; i++){
        if (expedientes[i].map == idMed){
            var expediente = Object.assign({}, expedientes[i]); // Crea una copia del expediente
            for (var j = 0; j < especialidades.length; j++){
                if (expediente.especialidad == especialidades[j].id){
                    expediente.especialidad = especialidades[j].nombre;
                }
            }
            expedientesMed.push(expediente);
        }
    }
    //console.log(expedientesMed)
    if (expedientesMed.length != 0){
        res.status(200).json(expedientesMed);
    }else{
        res.status(404).json("No hay expedientes para este médico");
    }
});

//?---------------------------------------------------------------------------------------
//* CREAR NUEVO EXPEDIENTE
// Crea un nuevo expediente asociado al id que entra en la url
app.post("/api/map/:id/expedientes", function(req, res){
    var idMed = req.params.id
    var nuevoExpediente = {
        id: id_nuevo_Expediente,
        map: idMed,
        me: "",
        especialidad: req.body.especialidad,
        sip: req.body.sip,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        fecha_nacimiento: req.body.fecha_nacimiento,
        genero: req.body.genero,
        observaciones: req.body.observaciones,
        solicitud: req.body.solicitud,
        respuesta: "",
        fecha_creacion: new Date().toLocaleString(),
        fecha_asignacion: "",
        fecha_resolucion: ""
    }
    if (nuevoExpediente.especialidad == "" || nuevoExpediente.sip == "" || nuevoExpediente.nombre == "" || nuevoExpediente.apellidos == "" || nuevoExpediente.fecha_nacimiento == "" || nuevoExpediente.genero == "" || nuevoExpediente.observaciones == "" || nuevoExpediente.solicitud == ""){
        return res.status(400).json("Ninguno de los campos puede estar vacío");
    }else{
        expedientes.push(nuevoExpediente);
        id_nuevo_Expediente++;
        res.status(201).json("Nuevo expediente creado");
    }

})

//?---------------------------------------------------------------------------------------
//* ACTUALIZAR LOS DATOS DE LOS EXPEDIENTES
// Actualiza los campos que vengan desde el cliente
app.put("/api/expediente/:id", function(req, res){
    var idExp = req.params.id;
    var datosExp = {
        especialidad: req.body.especialidad,
        sip: req.body.sip,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        fecha_nacimiento: req.body.fecha_nacimiento,
        genero: req.body.genero,
        observaciones: req.body.observaciones,
        solicitud: req.body.solicitud,
    }
    for (var i = 0; i < expedientes.length; i++){
        if (expedientes[i].id == idExp){
            for (var j = 0; j < expedientes.length; j++){
                if (expedientes[j].sip == datosExp.sip && j != i){
                    return res.status(400).json("El SIP ya está en uso");
                }
            }
            expedientes[i].especialidad = datosExp.especialidad;
            expedientes[i].sip = datosExp.sip;
            expedientes[i].nombre = datosExp.nombre;
            expedientes[i].apellidos = datosExp.apellidos;
            expedientes[i].fecha_nacimiento = datosExp.fecha_nacimiento;
            expedientes[i].genero = datosExp.genero;
            expedientes[i].observaciones = datosExp.observaciones;
            expedientes[i].solicitud = datosExp.solicitud;
            res.status(200).json("Datos actualizados");
        }
    }
    res.status(404).json("No existe el expediente");
})

//?---------------------------------------------------------------------------------------
//* ELIMINAR EXPEDIENTE 
// Con esta función, se elimina el expediente asociado al botón
app.delete("/api/expediente/:id", function(req, res){
    var idExp = req.params.id;
    for (var i = 0; i < expedientes.length; i++){
        if (expedientes[i].id == idExp){
            expedientes.splice(i, 1);
            return res.status(200).json("Expediente eliminado");
        }
    }
    res.status(404).json("No existe el expediente");
}) 



app.delete("/api/map/:idMedico/expnoasignados", function(req, res){
    var idMed = req.params.idMedico;
    var exp_eliminados = 0;
    for (var i = expedientes.length-1; i >=0; i--){
        if (expedientes[i].map == idMed && expedientes[i].me == 0){
            expedientes.splice(i, 1);
            exp_eliminados++;
        }
    }
    if (exp_eliminados == 0){
        res.status(404).json("No hay pacientes sin asignar");
    } else {
        res.status(200).json(exp_eliminados);
    }
}) 


//?---------------------------------------------------------------------------------------
//* NUEVO EXPEDIENTE
// Crea un nuevo expediente asociado al medico de atención primaria que lo crea (debe devolver el id del expediente creado) 

//?---------------------------------------------------------------------------------------
//* ACTUALIZAR EXPEDIENTE
// Actualiza los datos de un expediente 

//?---------------------------------------------------------------------------------------
//* ELIMINAR EXPEDIENTE 
// Elimina de forma definitiva un expediente 

app.listen(3000);// Servidor en el puerto 3000
console.log("Servidor REST en marcha");