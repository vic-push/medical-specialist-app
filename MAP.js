
//?----------------- VARIABLES GLOBALES ----------------------------
var seccionActual = "login"; // Sección del html donde se encuentra la página
//var usuario = ""; // Es el 'login' del medico que entra
var idMed = ""; // Es el 'id' del medico que entra
var nombreMedico = ""; // Es el 'nombre' del medico que entra
var idExp = ""; // Es el 'id' del expediente
//var idPac = ""; // Es el 'id' del paciente
//var idMedicamento = "";





//?----------------- ACCEDER LOGIN ----------------------------
function Acceder() {

    //Creamos un objeto con los valores obtenidos con el getElement del formulario
    var medico = {
        login: document.getElementById("usuario").value,
        password: document.getElementById("contraseña").value
    };

    //Se vacian los campos del formulario para que no se quede guardado todo lo que se ha escrito a la hora de acceder 
    document.getElementById("usuario").value = "";
    document.getElementById("contraseña").value = "";

    //Llamamos al método del servidor enviandole el objeto médico para que desde el servidor se vea si los valores de ususario y contraseña se encuentran dentro de la "base de datos (datos.js)"
    rest.post("/api/medico/login", medico, function(estado, respuesta ){
        //En el caso de que la petición sea correcta, la respuesta del servidor será 201 indicando que ha sido creado correctamente
        if (estado === 201) { //Se usa un 201 porque se ha creado un post 
            //Como se ha obtenido una respuesta positiva en  la llamada al servidor, procedemos a guardadr la respuesta (id) para poder utilizarla mas adelante. 
            idMed = respuesta
            
            //También llamamos a la función de cambio de sección para que el html se cambie al menú principal
            cambiarSeccion("menu_principal")
            //Creamos una variable que obtenga el objeto paciente de html para hacer un innner y se añada el saludo al médico que ha entrado. Para ello, obtenemos la varible de saludo y con un posterior get obtenemos toda la información del medico y a partir de la misma obtendremos su nombre y apellido.
            var saludo = document.getElementById('saludo');
            //Ahora hacemos un innerHTML, que básicamente hace que cambie el html asociado al id saludo. En concreto, ahora mismo se vacía la cadena para que no haya nada cuando posteriormente se añada el saludo al médico que ha entrado
            saludo.innerHTML = ""; 
            //Hacemos una llamada get al servidor para obtener los datos del paciente a través de la api con el id del médico. 
            rest.get("/api/medico/" + idMed, function(estado, medico){ //Se pone la api general con la concatenación del id del médico obtenido en el post anterior, para completar la api que tenemos en el servidor para que nos devuelva todos los datos asociados a dicho médico.
                if (estado == 200){ //Se usa codigo 200 para afirmar que el get ha sido correcto.
                    console.log(medico)
                    nombreMedico = medico.nombre;
                    //Mostramos por pantalla el saludo personificado al médico. Para ello utilizamos un innerHTML unido al objeto medico que ha returnado el get en el servidor
                    saludo.innerHTML += "¡Bienvenido " + medico.nombre + " " + medico.apellidos + " !"; //Las variables medico. vienen del objeto medico que se ha creado en la respuesta del metodo en el servidor

                    //DE MOMENTO AQUÍ VAMOS A LLAMAR A UNA FUNCION QUE SE DENOMINA IMPRIMIR PACIENTES, ESTA LO QUE VA A HACER ES IMPRIMIR TODOS LOS PACIENTES ASOCIADOS A DICHO MEDICO. 
                    //PARA ELLO USAREMOS LOS DATOS QUE DEVUELVA ESTA FUNCION EN LA LLAMADA A LA FUNCION
                    imprimirPacientes();

                    // Creamos la conexión con el WebSocket
                    conexion = new WebSocket("ws://localhost:4444", "clientes");
                    
                    // Cuando se establece la conexión, enviamos el ID del médico para identificarlo en el WebSocket
                    conexion.addEventListener('open', function(){
                        console.log("Medico conectado en WS");
                        // Cuando se conecta el médico enviamos su ID para en WS identificarlo
                        conexion.send(JSON.stringify({
                            origen : "map", 
                            idMed: idMed}));
                    });

                }
            });

        } else {
            swal({title:"ERROR" , text: respuesta, icon: "error"});
        }
    });
}





//?----------------- MOSTRAR EXPEDIENTES ----------------------------
// Creamos un array vacio donde mas adelante pondremos  todos los pacientes que nos devuelva la función
expAsignados = [];
// Funcion que obtiene todos los datos de los pacientes asignados a un medico en particular. Esta función se hace a parte para que se pueda utilizar desde mas funciones como por ejemplo, cuando se añada un paciene, al final de esa funcion se ejecute esta y vuelva al menu principal y muestre todo
function  imprimirPacientes(){
    //(En vista de posibles multiples usos) Cambiamos la seccion al menú principal que es donde se verán los pacientes asignados
    cambiarSeccion("menu_principal");
    //Realizamos  una petición GET a /api/map/:id/expedientes para que traiga un array con todos los datos de los expedientes asociados al id del medico
    rest.get("/api/map/" + idMed + "/expedientes", function(estado, pacientes){ //La variable idMed viene de la funcion acceder. Como respuesta hemos puesto pacientes para crear con el un array (objeto) con lo que devuelva el get
        //Como queremos imprimir en pantalla todos los pacientes y sus datos. En primer lugar, obtenemos el lugar del html donde los vamos a imprimir para despues hacer un innerHTML del resultado del método.
        lista = document.getElementById("pacientes");
        //Vaciamos el campo de pacientes para que no haya información cruzada
        lista.innerHTML = "";
        //Trasladamos toda la información obtenida por la respuesta del get del servidor al array vacio creado anteriormente
        expAsignados = pacientes;
        //Creamos un condicional de respuesta del rest para que entre cuando la respuesta sea correcta 
        if (estado == 200){
            //Recorremos el array de los pacientes asignados. De este array obtenemos los valores que queremos y ya los imprimimos en la pantalla
            for (var i = 0; i < expAsignados.length; i++){
                //Añadimos en cada iteración los valores del paciente al div del html que queremos. Esta parte del html lo hemos obtenido un poco antes en esta función, exactamente, en la variable lista
                lista.innerHTML += "<dl><dt><a href='#' class='dynamic-link' onclick='mod_expediente(" + expAsignados[i].id + ")'>Id: " + expAsignados[i].id + "</a></dt><dd>F. Creación: " + expAsignados[i].fecha_creacion + "</dd><dd>F. Asignación: " + expAsignados[i].fecha_asignacion + "</dd><dd>F. Resolución: " + expAsignados[i].fecha_resolucion + "</dd><dd>Especialidad: " + expAsignados[i].especialidad +"</dd><dd>SIP: " + expAsignados[i].sip+ 
                "</dd><dd><button class='btn' onclick='mod_expediente(" + expAsignados[i].id + ")'>Modificar datos</button> <button class='btn' onclick='chat(" + expAsignados[i].id + ")'>Chat</button>  </dd><br/><dd><button class='btn' onclick='Eliminar_Exp(" + expAsignados[i].id + ")'>Eliminar</button></dd></dl>";
            }
        } else{
            // Mostramos una alerta si hay un error en la obtención de los pacientes
            swal({title:"ERROR" , text:"Error en imprimir pacientes" , icon: "error"})
        }
    });
}




//?----------------- REGISTRAR MEDICO ----------------------------
//En esta sección se añade un nuevo médico
// Definición de la función Registro
function Registro(){
    // Llama a la función cambiarSeccion con el argumento "registro"
    cambiarSeccion("registro")
}

// Definición de la función nuevoMAP
function nuevoMAP(){
    // Crea un objeto medico con los valores de los campos de entrada correspondientes
    var medico = {
        nombre: document.getElementById("nombre_registro").value, // Obtiene el valor del campo de entrada con id "nombre_registro"
        apellidos: document.getElementById("apellido_registro").value, // Obtiene el valor del campo de entrada con id "apellido_registro"
        login: document.getElementById("usuario_registro").value, // Obtiene el valor del campo de entrada con id "usuario_registro"
        password: document.getElementById("password_registro").value, // Obtiene el valor del campo de entrada con id "password_registro"
        centro: document.getElementById("centros_registro").value // Obtiene el valor del campo de entrada con id "centros_registro"
    };

    // Hace una petición POST a la API en la ruta "/api/medico" con el objeto medico como cuerpo de la petición
    rest.post("/api/medico", medico, function (estado, respuesta){
        // Si el estado de la respuesta es 201 (creado con éxito)
        if (estado == 201){
            // Limpia los campos de entrada
            document.getElementById("nombre_registro").value = ""; // Borra el valor del campo de entrada con id "nombre_registro"
            document.getElementById("apellido_registro").value = "";// Borra el valor del campo de entrada con id "apellido_registro"
            document.getElementById("usuario_registro").value = "";// Borra el valor del campo de entrada con id "usuario_registro"
            document.getElementById("password_registro").value = "";// Borra el valor del campo de entrada con id "password_registro"
            document.getElementById("centros_registro").value = "";// Borra el valor del campo de entrada con id "centros_registro"
            // Muestra un cuadro de diálogo de éxito con el mensaje de la respuesta. Esto es buscado de internet para los alert's
            swal({title:respuesta, icon: "success"});
        }else{
            // Si el estado de la respuesta no es 201, muestra un cuadro de diálogo de error con el mensaje de la respuesta
            swal({title:"ERROR" , text: respuesta, icon: "error"});
        }
    })
}





//?----------------- CAMBIAR SECCION A MODIFICAR DATOS MEDICO ----------------------------
//En esta sección lo que se hace es rellenar con los datos del médico el formulario de actualización de datos. El centro no se muestra porque es un select y la contraseña tampoco porque no se puede obtener de la api que se usa ya que no se permite según el enunciado de la práctica.
// Definición de la función datosUsuario
function datosUsuario(){
    // Llama a la función cambiarSeccion con el argumento "actualizar"
    cambiarSeccion("actualizar")
    // Realiza una petición GET a la API en la ruta "/api/medico/" seguida del valor de idMed
    rest.get("/api/medico/" + idMed, function(estado, medico){
        // Si el estado de la respuesta es 200 (éxito)
        if (estado == 200){
            // Establece el valor del campo de entrada con id "nombre_actualizar" al nombre del médico obtenido de la respuesta
            document.getElementById("nombre_actualizar").value = medico.nombre;
            // Establece el valor del campo de entrada con id "apellido_actualizar" a los apellidos del médico obtenidos de la respuesta
            document.getElementById("apellido_actualizar").value = medico.apellidos;
            // Establece el valor del campo de entrada con id "usuario_actualizar" al login del médico obtenido de la respuesta
            document.getElementById("usuario_actualizar").value = medico.login;
            // Establece el valor del campo de entrada con id "password_actualizar" a una cadena vacía
            document.getElementById("password_actualizar").value = "";
            // Establece el valor del campo de entrada con id "centros_actualizar" al centro del médico obtenido de la respuesta
            document.getElementById("centros_actualizar").value = medico.centro;
        }
    });
}





//?----------------- ACTUALIZAR DATOS MEDICO ----------------------------
//Función para actualizar los datos del paciente que haya en el formulario de actualización
// Definición de la función actualizarMAP
function actualizarMAP(){
    // Crea un objeto medico con los valores de los campos de entrada correspondientes
    var medico = {
        nombre: document.getElementById("nombre_actualizar").value, // Obtiene el valor del campo de entrada con id "nombre_actualizar"
        apellidos: document.getElementById("apellido_actualizar").value, // Obtiene el valor del campo de entrada con id "apellido_actualizar"
        login: document.getElementById("usuario_actualizar").value, // Obtiene el valor del campo de entrada con id "usuario_actualizar"
        password: document.getElementById("password_actualizar").value, // Obtiene el valor del campo de entrada con id "password_actualizar"
        centro: document.getElementById("centros_actualizar").value // Obtiene el valor del campo de entrada con id "centros_actualizar"
    };

    // Hace una petición PUT a la API en la ruta "/api/medico/" seguida del valor de idMed, con el objeto medico como cuerpo de la petición
    rest.put("/api/medico/" + idMed, medico, function(estado, respuesta){
        // Si el estado de la respuesta es 200 (éxito)
        if (estado == 200){
            // Muestra un cuadro de diálogo de éxito con el mensaje de la respuesta
            swal({title:respuesta, icon: "success"});
            // Llama a la función cambiarSeccion con el argumento "menu_principal"
            cambiarSeccion("menu_principal")
            //Creamos una variable que obtenga el objeto paciente de html para hacer un innner y se añada el saludo al médico que ha entrado. Para ello, obtenemos la varible de saludo y con un posterior get obtenemos toda la información del medico y a partir de la misma obtendremos su nombre y apellido.
            var saludo = document.getElementById('saludo');
            //Ahora hacemos un innerHTML, que básicamente hace que cambie el html asociado al id saludo. En concreto, ahora mismo se vacía la cadena para que no haya nada cuando posteriormente se añada el saludo al médico que ha entrado
            saludo.innerHTML = ""; 
            //Hacemos una llamada get al servidor para obtener los datos del paciente a través de la api con el id del médico. 
            rest.get("/api/medico/" + idMed, function(estado, medico){ //Se pone la api general con la concatenación del id del médico obtenido en el post anterior, para completar la api que tenemos en el servidor para que nos devuelva todos los datos asociados a dicho médico.
                if (estado == 200){ //Se usa codigo 200 para afirmar que el get ha sido correcto.
                    console.log(medico)
                    nombreMedico = medico.nombre;
                    //Mostramos por pantalla el saludo personificado al médico. Para ello utilizamos un innerHTML unido al objeto medico que ha returnado el get en el servidor
                    saludo.innerHTML += "¡Bienvenido " + medico.nombre + " " + medico.apellidos + " !"; //Las variables medico. vienen del objeto medico que se ha creado en la respuesta del metodo en el servidor
            }});
        }else{
            // Si el estado de la respuesta no es 200, muestra un cuadro de diálogo de error con el mensaje de la respuesta
            swal({title:"ERROR" , text: respuesta, icon: "error"});
        }
    });
}





//?----------------- AÑADIR NUEVO EXPEDIENTE ----------------------------
//Función para crear un nuevo expediente asociado al médico que lo crea
// Definición de la función nuevoExpediente
function nuevoExpediente(){
    // Crea un objeto nuevoExpediente con los valores de los campos de entrada correspondientes y algunos campos vacíos
    var nuevoExpediente = {
        me: "",
        especialidad: document.getElementById("especialidades_expediente").value, // Obtiene el valor del campo de entrada con id "especialidades_expediente"
        sip: document.getElementById("sip_expediente").value, // Obtiene el valor del campo de entrada con id "sip_expediente"
        nombre: document.getElementById("nombre_expediente").value, // Obtiene el valor del campo de entrada con id "nombre_expediente"
        apellidos: document.getElementById("apellido_expediente").value, // Obtiene el valor del campo de entrada con id "apellido_expediente"
        fecha_nacimiento: document.getElementById("fecha_nacimiento_expediente").value, // Obtiene el valor del campo de entrada con id "fecha_nacimiento_expediente"
        genero: document.getElementById("genero_expediente").value, // Obtiene el valor del campo de entrada con id "genero_expediente"
        observaciones: document.getElementById("observaciones_expediente").value, // Obtiene el valor del campo de entrada con id "observaciones_expediente"
        solicitud: document.getElementById("solicitud_expediente").value, // Obtiene el valor del campo de entrada con id "solicitud_expediente"
        respuesta: "",
        fecha_creacion: "",
        fecha_asignacion: "",
        fecha_resolucion: ""
    }

    // Imprime el objeto nuevoExpediente en la consola
    console.log(nuevoExpediente)

    // Hace una petición POST a la API en la ruta "/api/map/" seguida del valor de idMed y "/expedientes", con el objeto nuevoExpediente como cuerpo de la petición
    rest.post("/api/map/" + idMed + "/expedientes", nuevoExpediente, function(estado,respuesta){
        // Si el estado de la respuesta es 201 (creado con éxito)
        if (estado == 201){
            // Llama a la función imprimirPacientes
            imprimirPacientes();
            // Limpia los campos de entrada
            document.getElementById("especialidades_expediente").value = "";
            document.getElementById("sip_expediente").value = "";
            document.getElementById("nombre_expediente").value = "";
            document.getElementById("apellido_expediente").value = "";
            document.getElementById("fecha_nacimiento_expediente").value = "";
            document.getElementById("genero_expediente").value = "";
            document.getElementById("observaciones_expediente").value = "";
            document.getElementById("solicitud_expediente").value = "";
            // Muestra un cuadro de diálogo de éxito con el mensaje de la respuesta
            swal({title:respuesta, icon: "success"});
        }else{
            // Si el estado de la respuesta no es 201, muestra un cuadro de diálogo de error con el mensaje de la respuesta
            swal({title:"ERROR" , text: respuesta, icon: "error"});
        }
    });
}





//?----------------- CAMBIAR SECCIÓN A MODIFICAR DATOS EXPEDIENTE ----------------------------
//Función asociada al botón de modificar los datos de un expediente, en este primer botón se va a traer la información para rellenar el formulario con los datos que hay guardados de ese expediente.
// Definición de la función mod_expediente
function mod_expediente(idExpediente){
    // Llama a la función cambiarSeccion con el argumento "mod_expediente"
    cambiarSeccion("mod_expediente")

    // Hace una petición GET a la API en la ruta "/api/map/" seguida del valor de idMed y "/expedientes"
    rest.get("/api/map/" + idMed + "/expedientes", function(estado, respuesta){
        // Imprime la respuesta en la consola
        console.log(respuesta)

        // Si el estado de la respuesta es 200 (éxito)
        if (estado == 200){
            // Recorre la respuesta
            for (var i = 0; i < respuesta.length; i++){
                // Si el id del expediente actual es igual al idExpediente
                if (respuesta[i].id == idExpediente){
                    // Rellena los campos de entrada con los valores del expediente actual
                    document.getElementById("mod_id_expediente").value = respuesta[i].id;
                    document.getElementById("mod_ME_expediente").value = respuesta[i].me;
                    document.getElementById("mod_especialidades_expediente").value = respuesta[i].especialidad;
                    document.getElementById("mod_sip_expediente").value = respuesta[i].sip;
                    document.getElementById("mod_nombre_expediente").value = respuesta[i].nombre;
                    document.getElementById("mod_apellido_expediente").value = respuesta[i].apellidos;
                    document.getElementById("mod_fecha_nacimiento_expediente").value = respuesta[i].fecha_nacimiento;
                    document.getElementById("mod_genero_expediente").value = respuesta[i].genero;
                    document.getElementById("mod_observaciones_expediente").value = respuesta[i].observaciones;
                    document.getElementById("mod_solicitud_expediente").value = respuesta[i].solicitud;
                    document.getElementById("mod_respuesta_expediente").value = respuesta[i].respuesta;
                    document.getElementById("mod_fecha_solicitud_expediente").value = respuesta[i].fecha_creacion;
                    document.getElementById("mod_fecha_asignacion_expediente").value = respuesta[i].fecha_asignacion;
                    document.getElementById("mod_fecha_resolucion_expediente").value = respuesta[i].fecha_resolucion;
                }
            }
        } else {
            // Si el estado de la respuesta no es 200, muestra un cuadro de diálogo de error con el mensaje "No se ha podido modificar el expediente"
            swal({title:"ERROR" , text: "No se ha podido modificar el expediente", icon: "error"});
        }   
    });
}





//?----------------- ACTUALIZAR DATOS EXPEDIENTE ---------------------------------  
//Función para actualizar los datos de un expediente
// Definición de la función guardarExpediente_mod
function guardarExpediente_mod(){
    // Obtiene el valor del campo de entrada con id "mod_id_expediente" y lo guarda en la variable idExpediente
    var idExpediente=document.getElementById("mod_id_expediente").value;

    // Crea un objeto expediente con los valores de los campos de entrada correspondientes
    var expediente = {
        especialidad: document.getElementById("mod_especialidades_expediente").value,
        sip: document.getElementById("mod_sip_expediente").value,
        nombre: document.getElementById("mod_nombre_expediente").value,
        apellidos: document.getElementById("mod_apellido_expediente").value,
        fecha_nacimiento: document.getElementById("mod_fecha_nacimiento_expediente").value,
        genero: document.getElementById("mod_genero_expediente").value,
        observaciones: document.getElementById("mod_observaciones_expediente").value,
        solicitud: document.getElementById("mod_solicitud_expediente").value,
    }

    // Hace una petición PUT a la API en la ruta "/api/expediente/" seguida del valor de idExpediente, con el objeto expediente como cuerpo de la petición
    rest.put("/api/expediente/" + idExpediente, expediente, function(estado, respuesta){
        // Si el estado de la respuesta es 200 (éxito)
        if (estado == 200){
            // Muestra un cuadro de diálogo de éxito con el mensaje de la respuesta
            swal({title:respuesta, icon: "success"});
            // Llama a la función imprimirPacientes
            imprimirPacientes();
        }else{
            // Si el estado de la respuesta no es 200, muestra un cuadro de diálogo de error con el mensaje de la respuesta
            swal({title:"ERROR" , text: respuesta, icon: "error"});
        }
    })
};





//?----------------- ELIMINAR EXPEDIENTE ---------------------------------  
//Función para actualizar los datos de un expediente
// Definición de la función Eliminar_Exp
function Eliminar_Exp(idExpediente){
    // Hace una petición DELETE a la API en la ruta "/api/expediente/" seguida del valor de idExpediente
    rest.delete("/api/expediente/"+ idExpediente, function(estado, respuesta){
        // Si el estado de la respuesta es 200 (éxito)
        if(estado  == 200){
            // Muestra un cuadro de diálogo de éxito con el mensaje de la respuesta
            swal({title:respuesta, icon: "success"});
            // Llama a la función imprimirPacientes
            imprimirPacientes();
        }else{
            // Si el estado de la respuesta no es 200, muestra un cuadro de diálogo de error con el mensaje de la respuesta
            swal({title:"ERROR" , text: respuesta, icon: "error"});
        }
    })
};





//?----------------- CAMBIAR SECCION ----------------------------
// Función para cambiar de seccion del index.html (login,menu_principal...)
// Definición de la función cambiarSeccion
function cambiarSeccion(seccion) {
    // Obtiene el elemento con el id igual a seccionActual y le quita la clase "activa"
    document.getElementById(seccionActual).classList.remove("activa");

    // Obtiene el elemento con el id igual a seccion y le añade la clase "activa"
    document.getElementById(seccion).classList.add("activa");

    // Actualiza el valor de seccionActual con el valor de seccion
    seccionActual = seccion;
}





//?----------------- IR A MENÚ PRINCIPAL ----------------------------
// Función para ir al menú principal desde cada botón de volver 
// Definición de la función volver
function volver(){
    // Llama a la función cambiarSeccion con el argumento "menu_principal"
    cambiarSeccion("menu_principal");
}





//?----------------- SALIR AL LOGIN ----------------------------
// Función para salir al login
// Definición de la función salir
function salir(){
    // Muestra un cuadro de diálogo de información con el título "Adiós" y el texto "Nos vemos pronto"
    swal({title: "Adiós", text: "Nos vemos pronto", icon: "info"});

    // Llama a la función cambiarSeccion con el argumento "login"
    cambiarSeccion("login");
}






function chat(idExpediente) {
    idExp = idExpediente;
    console.log("mensaje");
    
    cambiarSeccion("chatRest");
 //*---------------------------------------------WS--AQUI RECIBIMOS LOS MENSAJES DEL ME---------------------

 conexion.addEventListener('message', function(event){
    var msg = JSON.parse(event.data);
    console.log("Objeto msg:", msg); // Imprime el objeto msg

    if (msg.origen == "texto_me"){
        var texto = msg.texto;
        var fecha = msg.fecha;
        var nombreme = msg.me;
        document.getElementById("mensajes_recibidos_map").innerHTML += "<li>mensaje de: " + nombreme + "<br>fecha: " + fecha + "<br>mensaje: " + texto + "</li>";
    }
    if(msg.comprobamos == "error"){
        swal({title:"ERROR" , text: msg.mensaje, icon: "error"});
    }
});

    // También puedes realizar otras acciones relacionadas con el expediente, si es necesario
    console.log("Expediente ID:", idExpediente);
}

//*----------------- WS----------------ENVIAR MENSAJE CON SOCKETS AL ME ----------------------------
function enviar(){
    // Obtenemos el elemento con el id "Mensajemap" y lo almacenamos en la variable "mensaje"
    var mensaje = document.getElementById("nuevoMensaje").value;

    // Obtenemos la fecha actual en formato de cadena de texto
    var fechaActual = new Date().toLocaleDateString();

    // Enviamos los datos obtenidos al WS
    conexion.send(JSON.stringify({
        origen : "texto_map", 
        texto : mensaje,
        map: nombreMedico, 
        fecha: fechaActual,
        idExpediente: idExp
    }));


    console.log("mensaje:",mensaje)

    // Limpiamos el contenido del campo de mensaje
    document.getElementById("nuevoMensaje").value = "";
}

function eliminarAsignados(){
    rest.delete("/api/map/"+ idMed +"/expnoasignados", function(estado, respuesta){
        if (estado == 200){
            alert("El número de expedientes eliminados es: " + respuesta)
            imprimirPacientes();

        } else {
            alert("No hay expedientes para eliminar ")
        }
    })
}