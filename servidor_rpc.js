var rpc = require("./rpc.js");
var datos = require("./datos.js"); // cargo los datos

//Variables de acceso directo de los datos. Estos datos están presentes en el archivo datos.js
var especialidades = datos.especialidades;
var centros = datos.centros;
var medicos = datos.medicos;
var expedientes = datos.expedientes;
var id_nuevo_Medico = datos.id_nuevo_Medico
var id_nuevo_Expediente = datos.id_nuevo_Expediente

//?---------------------------------------------------------------------------------------
//* OBTENER ARRAY CON LAS ESPECIALIDADES
function obtenerEspecialidades(){
    return especialidades;
}

//?---------------------------------------------------------------------------------------
//* OBTENER ARRAY CON LOS CENTROS
function obtenerCentros(){
    return centros;
}

//?---------------------------------------------------------------------------------------
//* LOGIN
function login(usuario, password){
    for (var i = 0; i < medicos.length; i++){
        if (medicos[i].login == usuario && medicos[i].password == password && medicos[i].especialidad != 0){
            return medicos[i];
        }
    }
    return false;
}

//?---------------------------------------------------------------------------------------
//* CREAR MEDICO ESPECIALISTA
function crearME(nuevo_medico){
    var datos_nuevo_medico = {
        id: id_nuevo_Medico,
        nombre: nuevo_medico.nombre,
        apellidos: nuevo_medico.apellidos,
        login: nuevo_medico.usuario,
        password: nuevo_medico.password,
        centro: nuevo_medico.centro,
        especialidad: nuevo_medico.especialidad
    };
    for (i = 0; i < medicos.length; i++){
        if (medicos[i].login == datos_nuevo_medico.usuario){
            return false;
        }
    }
    if (datos_nuevo_medico.nombre == "" || datos_nuevo_medico.apellidos == "" || datos_nuevo_medico.usuario == "" || datos_nuevo_medico.password == "" || datos_nuevo_medico.centro == "" || datos_nuevo_medico.especialidad == ""){
        return null;
    } else {
        medicos.push(datos_nuevo_medico);
        id_nuevo_Medico++;
        return datos_nuevo_medico
    }
}

//?---------------------------------------------------------------------------------------
//* ACTUALIZAR DATOS DEL MÉDICO ESPECIALISTA
function actualizarme(datos,idMed){
    for (i = 0; i < medicos.length; i++){
        if (medicos[i].id == idMed){
            for (j = 0; j < medicos.length; j++){
                if (medicos[j].login == datos.login && i!=j){
                    return false;
                }
            }
            if (datos.nombre == "" || datos.apellidos == "" || datos.login == "" || datos.password == "" || datos.especialidad == "" || datos.centro == ""){
                return null;
            }
            medicos[i].nombre = datos.nombre;
            medicos[i].apellidos = datos.apellidos;
            medicos[i].login = datos.login;
            medicos[i].password = datos.password;
            medicos[i].centro = datos.centro;
            medicos[i].especialidad = datos.especialidad;
            return true;
        }
    }

}

//?---------------------------------------------------------------------------------------
//* OBTENER DATOS DEL MÉDICO
function obtenerDatosMedico(idMed){
    for (i = 0; i < medicos.length; i++){
        if (medicos[i].id == idMed){
            return medicos[i];
        }
    }
    return false;
}

//?---------------------------------------------------------------------------------------
//* OBTENER EXPEDIENTES DISPONIBLES
function obtenerExpDisponibles(idEspecialidad){
    los_disponibles = []; //Aquí hacemos el array para que devuelva todos los que encuentre y no solo el primero
    for (i = 0; i<expedientes.length; i++){
        if (expedientes[i].especialidad == idEspecialidad){
            los_disponibles.push(expedientes[i]);
        }
    }
    if (los_disponibles.length == 0){
        return false;
    }
    return los_disponibles

}

//?---------------------------------------------------------------------------------------
//* ASIGNAR EXPEDIENTES
function asignarExp(idMed,idExp){
    f_asignacion = new Date().toLocaleString()
    for (i = 0; i < expedientes.length; i++){
        if (expedientes[i].id == idExp){
            expedientes[i].me = idMed;
            expedientes[i].fecha_asignacion = f_asignacion
            return expedientes[i];
        }
    }
    return false;
}

//?---------------------------------------------------------------------------------------
//* OBTENER EXPEDIENTES ASIGNADOS 
function obtenerExpAsignados(idMed){
    var expedientes_asignados = [];
    for (i = 0; i < expedientes.length; i++){
        if (expedientes[i].me == idMed){
            expedientes_asignados.push(expedientes[i]);
        }
    }
    if (expedientes_asignados.length == 0){
        return false;
    } else {
        return expedientes_asignados;
    }

}

//?---------------------------------------------------------------------------------------
//* RESOLVER EXPEDIENTE
function resolverExp(idExp, respuesta){
    for (i = 0; i < expedientes.length; i++){
        if (expedientes[i].id == idExp){
            expedientes[i].respuesta = respuesta;
            expedientes[i].fecha_resolucion = new Date().toLocaleString();
            return true;
        }
    }
    return false;
}





























/**AQUÍ VOY A APUNTAR MAS O MENOS COMO ES LA SINTAXIS DE CREAR LAS FUNCIONES EN EL SERVIDOR DE RPC
 * Entiendo que los argumentos de la función vienen dados de la llamada de esta en el archivo js del medico especialista por lo que si
 * no son recogidos en ese js la función no podrá hacer nada
 * function mifuncion(aqui_van_los_argumentos){
 * 
 *  }
 */
var servidor = rpc.server();
var app = servidor.createApp("aplicacion_me");
app.register(obtenerEspecialidades);
app.register(obtenerCentros);
app.register(login);
app.register(crearME);
app.register(obtenerDatosMedico);
app.register(actualizarme);
app.register(obtenerExpDisponibles);
app.register(asignarExp);
app.register(obtenerExpAsignados);
app.register(resolverExp);
console.log("Servidor RPC en marcha");

