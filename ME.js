/*Antes de empezar, voy a indicar que el archivo rpc.js de la carpeta ME es el que da el profesor como rpc_cliente.js o algo similar, el que hay en la carpeta de servidor hace referencia al que
da el profesor para el servidor. En esta carpeta también he añadido el archivo rest.js porque he visto que otros años lo han hecho así.*/
var app = rpc("localhost", "aplicacion_me");
var obtenerEspecialidades = app.procedure("obtenerEspecialidades");
var obtenerCentros = app.procedure("obtenerCentros");
var login = app.procedure("login");
var crearME = app.procedure("crearME");
var obtenerDatosMedico = app.procedure("obtenerDatosMedico");
var actualizarme = app.procedure("actualizarme");
var obtenerExpDisponibles = app.procedure("obtenerExpDisponibles");
var asignarExp = app.procedure("asignarExp");
var obtenerExpAsignados = app.procedure("obtenerExpAsignados");
var resolverExp = app.procedure("resolverExp");

//?----------------- VARIABLES GLOBALES ----------------------------
idMed = "";
seccionActual = "login";
idEspecialidad = "";
nombreMe = "";
idExp = "";

//?----------------- OBTENER ESPECIALIDADES ----------------------------
//Primero hacemos la función de cambiar de sección para poder ir moviendonos a través de las diferentes pantallas del html
function cambiarSeccion(seccion) {
    // Obtiene el elemento con el id igual a seccionActual y le quita la clase "activa"
    document.getElementById(seccionActual).classList.remove("activa");

    // Obtiene el elemento con el id igual a seccion y le añade la clase "activa"
    document.getElementById(seccion).classList.add("activa");

    // Actualiza el valor de seccionActual con el valor de seccion
    seccionActual = seccion;
}


//?----------------- ACCEDER LOGIN ----------------------------
function Acceder(){
    var usuario = document.getElementById('usuario').value;
    var password = document.getElementById('contraseña').value;
    login(usuario, password, function(resultado){
        if (resultado == false){
            swal({title:"ERROR" , text: "Error autentificando", icon: "error"}); //El swal es para el alert diferente al igual que en el rest
        }else{
            idMed = resultado.id
            idEspecialidad = resultado.especialidad
            nombreMe = resultado.nombre
            cambiarSeccion('menu_principal')
            obtenerDatosMedico(idMed, function(datos){
                if (datos == false){
                    swal({title:"ERROR" , text: "Error al obtener datos", icon: "error"}); 
                }else{
                    nombre = datos.nombre;
                    saludo = document.getElementById('saludo');
                    saludo.innerHTML = "";
                    saludo.innerHTML += "Bienvenido "+ datos.nombre + " " + datos.apellidos +"";
                }
                 // Creamos una conexión WebSocket hacia el servidor
                conexion = new WebSocket("ws://localhost:4444", "clientes"); // Creamos conexion
                    
                conexion.addEventListener('open', function(){
                    console.log("me conectado en WS",idMed);

                    conexion.send(JSON.stringify({
                        origen : "me",
                        me: idMed
                    }));
                
                })
            })
        }
    })
}


//?----------------- REGISTRAR NUEVO ME ----------------------------
function nuevoME(){
    datos_nuevo_medico = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellido').value,
        usuario: document.getElementById('n_usuario').value,
        password: document.getElementById('password').value,
        centro: document.getElementById('centros').value,
        especialidad: document.getElementById('especialidad').value,
    }
    if (datos_nuevo_medico.centro != "Centro adscrito" && datos_nuevo_medico.especialidad != "Especialidad"){
        crearME(datos_nuevo_medico, function(resultado){
            if (resultado == false){
                swal({title:"ERROR" , text: "El usuario ya está en uso", icon: "error"});
            } else if (resultado == null){
                swal({title:"ERROR" , text: "Faltan campos por completar", icon: "error"});
            } else {
                swal({title:"CORRECTO" , text: "Médico creado con éxito", icon: "success"});
                cambiarSeccion('login')
                document.getElementById('nombre').value = "";
                document.getElementById('apellido').value = "";
                document.getElementById('n_usuario').value = "";
                document.getElementById('password').value = "";
                document.getElementById('centros').value = "";
                document.getElementById('especialidad').value = "";
            }
        })
    } else {
        swal({title:"ERROR" , text: "Faltan campos por completar", icon: "error"});
    }
}


function datosUsuario(){
    cambiarSeccion("editar_especialista")
    obtenerDatosMedico(idMed,function(resultado){
        if (resultado == false){
            swal({title:"ERROR" , text: "Error al obtener datos", icon: "error"});
        } else {
            document.getElementById('editar_nombre_registro').value = resultado.nombre;
            document.getElementById('editar_apellido_registro').value = resultado.apellidos;
            document.getElementById('editar_usuario_registro').value = resultado.login;
            document.getElementById('editar_password_registro').value = resultado.password;
            document.getElementById('editar_centros_registro').value = resultado.centro;
            document.getElementById('editar_especialidades').value = resultado.especialidad;
        }
    })
    //Vamos a ver que pasa si no pongo como parametro el id del médico pero trabajo con el en el servidor
}


//En esta función no hace falta poner como parámetro el id del médico ya que lo tenemos como variable global 
// por lo tanto, se la podemos pasar al servidor
function editarME(){
    datos = {
        nombre: document.getElementById('editar_nombre_registro').value,
        apellidos: document.getElementById('editar_apellido_registro').value,
        login: document.getElementById('editar_usuario_registro').value,
        password: document.getElementById('editar_password_registro').value,
        centro: document.getElementById('editar_centros_registro').value,
        especialidad: document.getElementById('editar_especialidades').value

    }
    actualizarme(datos, idMed, function(resultado){
        if (resultado = false){
            swal({title:"ERROR" , text: "El login ya esta en uso", icon: "error"})
        }
        else if (resultado = null){
            swal({title:"ERROR" , text: "Faltan campos por completar", icon: "error"})
        }else{
            swal({title:"CORRECTO" , text: "Datos modificados con éxito", icon: "success"});
            cambiarSeccion('menu_principal')
            obtenerDatosMedico(idMed, function(datos){
                if (datos == false){
                    swal({title:"ERROR" , text: "Error al obtener datos", icon: "error"}); 
                }else{
                    saludo = document.getElementById('saludo');
                    saludo.innerHTML = "";
                    saludo.innerHTML += "Bienvenido "+ datos.nombre + " " + datos.apellidos +"";
                }
            })
        }
    })
}


function asignar_expediente(){
    cambiarSeccion('asignar_expedientes')
    obtenerExpDisponibles(idEspecialidad, function(resultado){
        if (resultado == false){
            swal({title:"ERROR", text: "No se han podido obtener los expedientes", icon: "error"});
        }else{
            lista = document.getElementById('expedientes')
            lista.innerHTML = "";
            var expedientes_disponibles = resultado
            for (i = 0; i < expedientes_disponibles.length; i++){
                if (expedientes_disponibles[i].me == 0){
                    let uniqueId = 'nombre_map' + i;
                    lista.innerHTML += "<dl><dt><a href='#' class='dynamic-link' onclick='mod_expediente(" + expedientes_disponibles[i].id + ")'>Id: " + expedientes_disponibles[i].id + "</a></dt><dd>F. Creación: " + expedientes_disponibles[i].fecha_creacion + "</dd><dd id = '" + uniqueId + "'>MAP: " + "</dd><dd><button class='btn' onclick='mod_expediente(" + expedientes_disponibles[i].id + ")'>Asignar</button> <button class = 'btn' onclick = 'chat(" + expedientes_disponibles[i].id + ")'> Chat </button> </dd></dl>";
                    obtenerDatosMedico(expedientes_disponibles[i].map, function(datos){
                        if (datos == false){
                            swal({title:"ERROR", text: "No se encuentran datos del MAP", icon: "error"});
                        } else {
                            let nombre = document.getElementById(uniqueId)
                            nombre.innerHTML += datos.nombre + " " + datos.apellidos;
                        }
                    }
                )
                }
            }
        }
    })
}


function mod_expediente(idExp){
    cambiarSeccion('form_expediente')
    asignarExp(idMed, idExp, function(resultado){
        if (resultado == false){
            swal({title:"ERROR", text: "No se ha podido asignar el expediente", icon: "error"});
        } else {
            swal({title:"CORRECTO", text: "Expediente asignado con éxito", icon: "success"});
            console.log(resultado)
            document.getElementById('id_expediente').value = resultado.id;
            document.getElementById('especialidades_expediente').value = resultado.especialidad;
            document.getElementById('sip_expediente').value = resultado.sip;
            document.getElementById('nombre_expediente').value = resultado.nombre;
            document.getElementById('apellido_expediente').value = resultado.apellidos;
            document.getElementById('fecha_nacimiento_expediente').value = resultado.fecha_nacimiento;
            document.getElementById('genero_expediente').value = resultado.genero;
            document.getElementById('observaciones_expediente').value = resultado.observaciones;
            document.getElementById('solicitud_expediente').value = resultado.solicitud;
            document.getElementById('respuesta_expediente').value = resultado.respuesta;
            document.getElementById('fecha_solicitud_expediente').value = resultado.fecha_creacion;
            document.getElementById('fecha_asignacion_expediente').value = resultado.fecha_asignacion;
            document.getElementById('fecha_resolucion_expediente').value = resultado.fecha_resolucion;
            obtenerDatosMedico(resultado.me, function(datos){
                if (datos == false){
                    swal({title:"ERROR", text: "No se el nombre del ME", icon: "error"});
                } else {
                    document.getElementById('ME_expediente').value = datos.nombre + " " + datos.apellidos;
                }
            })
        }
    })
}


function resolucion_exp(){
    respuesta = document.getElementById('respuesta_expediente').value;
    idExp = document.getElementById('id_expediente').value;
    resolverExp(idExp, respuesta, function(resultado){
        if (resultado == true){
            swal({title:"CORRECTO", text: "Expediente resuelto con éxito", icon: "success"});
            asignar_expediente()
        } else {
            swal({title:"ERROR", text: "No se ha podido resolver el expediente", icon: "error"});
        }
    })
}


function expedientes_asignados(){
    cambiarSeccion('form_expedientes_asignados');
    obtenerExpAsignados(idMed, function(resultado){
        if (resultado == false){
            swal({title:"ERROR", text: "No hay expedientes asignados", icon: "error"});
        } else {
            lista_asignados = document.getElementById('formlist_expedientes_asignados')
            lista_asignados.innerHTML = "";
            var expedientes_asignados = resultado
            for (i = 0; i < expedientes_asignados.length; i++){
                if (expedientes_asignados[i].me == idMed){
                    lista_asignados.innerHTML += "<dl><dt><a href='#' class='dynamic-link' onclick='resolution(" + expedientes_asignados[i].id + ")'>Id: " + expedientes_asignados[i].id + "</a></dt><dd>F. Creación: " + expedientes_asignados[i].fecha_creacion + "</dd><dd>F. Asignacion: " + expedientes_asignados[i].fecha_asignacion +  "</dd><dd>F. Resolucion: " + expedientes_asignados[i].fecha_resolucion + "</dd><dd> SIP " + expedientes_asignados[i].sip + "</dd><dd><button class='btn' onclick='resolution(" + expedientes_asignados[i].id + ")'>Resolver</button></dd><dd><button class='btn' onclick='chat(" + expedientes_asignados[i].id + ")'>Chat</button></dd></dl>";                }
            }
        }
    })
}

//Esta es la función para volver al listad de expedientes sin asignar desde el formulario de un expediente que ya he cogido.
function volver_listado(){
    asignar_expediente()
}

function resolution(idExp){
    obtenerExpAsignados(idMed, function(expAsignados){
        // Recorre los expedientes asignados
        for (var i = 0; i < expAsignados.length; i++) {
            if (expAsignados[i].id === idExp) {
                var expediente = expAsignados[i];
                document.getElementById("id_expediente_a").value = expediente.id;
                document.getElementById("especialidades_expediente_a").value = expediente.especialidad;
                document.getElementById("sip_expediente_a").value = expediente.sip;
                document.getElementById("nombre_expediente_a").value = expediente.nombre;
                document.getElementById("apellido_expediente_a").value = expediente.apellidos;
                document.getElementById("fecha_nacimiento_expediente_a").value = expediente.fecha_nacimiento;
                document.getElementById("genero_expediente_a").value = expediente.genero;
                document.getElementById("observaciones_expediente_a").value = expediente.observaciones;
                document.getElementById("solicitud_expediente_a").value = expediente.solicitud;
                document.getElementById("respuesta_expediente_a").value = expediente.respuesta;
                document.getElementById("fecha_solicitud_expediente_a").value = expediente.fecha_creacion;
                document.getElementById("fecha_asignacion_expediente_a").value = expediente.fecha_asignacion;
                document.getElementById("fecha_resolucion_expediente_a").value = expediente.fecha_resolucion;
                obtenerDatosMedico(expediente.me, function(datos){
                    if (datos == false){
                        swal({title:"ERROR", text: "Error al obtener el nombre del ME", icon: "error"});
                    } else {
                        document.getElementById('ME_expediente_a').value = datos.nombre + " " + datos.apellidos;
                        swal({title:"Success", text: "ME correcto", icon: "success"})
                    }
                })
                cambiarSeccion("form_expediente_asignado") 
            }
        }
    });
}

function Resolver(){
    respuesta = document.getElementById('respuesta_expediente_a').value;
    idExp = document.getElementById('id_expediente_a').value;
    if(respuesta){
        resolverExp(idExp, respuesta, function(resultado){
            if(resultado){
                swal({title: "Success", text: "Expediente resuelto con éxito.", icon: "success"});
                cambiarSeccion("asignar_expedientes");
            }else{
                swal({title: "ERROR", text: "Error al resolver el expediente.", icon: "error"});
            }
        })
    }else{
        swal({title: "ERROR", text: "Debe introducir una respuesta.", icon: "error"});
    }

}


//-----------------------EN EL ESPECIALISTA-----------------------
function chat(idExpediente) {
    idExp = idExpediente;
    console.log("Iniciando chat con idExpediente:", idExpediente);
    cambiarSeccion("chatRPC");

    conexion.addEventListener('message', function(event){
        console.log("Mensaje recibido:", event.data);
        var msg = JSON.parse(event.data);
        console.log("Objeto msg:", msg); // Imprime el objeto msg

        if (msg.origen == "texto_map"){
            var texto = msg.texto;
            var fecha = msg.fecha;
            var nombremap = msg.map; 

            console.log("Mensaje de:", nombremap, "Fecha:", fecha, "Texto:", texto);
            document.getElementById("mensajes_recibidos_me").innerHTML += "<li>mensaje de: " + nombremap + "<br>fecha: " + fecha + "<br>mensaje: " + texto + "</li>";
        }

        if(msg.comprobamos == "error"){
            console.error("Error recibido:", msg.mensaje);
            alert(msg.mensaje);
        }
    });
}


function enviarMensaje(){
    var mensaje = document.getElementById("nuevoMensajeRPC").value;
    var fechaActual = new Date().toLocaleDateString();

    console.log("Enviando mensaje:", mensaje, "Fecha:", fechaActual, "Nombre:", nombreMe);

    conexion.send(JSON.stringify({
        origen : "texto_me", 
        texto : mensaje, 
        me: nombreMe, 
        fecha: fechaActual,
        idExpediente: idExp
    }));

    cambiarSeccion("chatRPC");
    document.getElementById("nuevoMensajeRPC").value = "";
}
