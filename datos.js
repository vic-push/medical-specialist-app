//? ARRAY ESPECIALIDADES

var especialidades = [
    {id: 1, nombre: "Cardiología"},
    {id: 2, nombre: "Dermatología"},
    {id: 3, nombre: "Alergología"},
    {id: 4, nombre: "Reumatología"},
    {id: 5, nombre: "Psiquiatría"},
    {id: 6, nombre: "Obstetricía y Ginecología"},
    {id: 7, nombre: "Geriatría"},
    {id: 8, nombre: "Inmunología"},
    {id: 9, nombre: "Neurología"},
    {id: 10, nombre: "Urología"},
];
module.exports.especialidades = especialidades; //Exportación de los datos que hay dentro del array especializades como una variable

//? ARRAY CENTROS 

var centros = [
    {id: 1, nombre: "Hospital General Universitario de Alicante"},
    {id: 2, nombre: "Hospital Universitari Sant Joan d'Alacant"},
    {id: 3, nombre: "Hospital Vithas Alicante"},
    {id: 4, nombre: "Neuroklinik"},
    {id: 5, nombre: "Clínica HLA Vistahermosa"},
];
module.exports.centros = centros; //Exportación datos del array de los centros

//? ARRAY MEDICOS 
    // Se debe tener en cuenta que los médicos de atención primaria no tienen una especialidad por lo que se pondrá 0 en el valor de especialidad  

var medicos = [
    {id: 1, nombre: "Justo", apellidos: "Vaquero López", login: "map1", password: "map1", especialidad: 0, centro: 1},
    {id: 2, nombre: "Pablo", apellidos: "Mañas", login: "map2", password: "map2", especialidad: 0, centro: 1},
    {id: 3, nombre: "Beatriz", apellidos: "Alemany", login: "me1", password: "me1", especialidad: 1, centro: 2},
    {id: 4, nombre: "Maria", apellidos: "Riera", login: "me2", password: "me2", especialidad: 1, centro: 3},
    {id: 5, nombre: "Desiree", apellidos: "Armas", login: "me3", password: "me3", especialidad: 2, centro: 4},
    {id: 6, nombre: "Marta", apellidos: "García", login: "me4", password: "me4", especialidad: 2, centro: 5},
];
module.exports.medicos = medicos; //Exportación de la lista de médicos con sus respectivas propiedades
var id_nuevo_Medico = 7
module.exports.id_nuevo_Medico = id_nuevo_Medico; //Exportación del id del nuevo médico

//? ARRAY EXPEDIENTES
    // Hay que tener en cuenta que si el expediente no tiene asignado un medico especialista el valor del id de este será 0.
    // El map hace referencia al id del medico de atencion primaria que lleva el expediente. me es lo mismo pero de especialista
var expedientes = [
    {id: 1, map: 1, me: 0, especialidad:1, sip: "000000000000",nombre: "Tomas", apellidos: "Puente", fecha_nacimiento: "1998-12-10", genero: "Hombre", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 2, map: 1, me: 0, especialidad:2, sip: "000000000001",nombre: "Triana", apellidos: "Moyano", fecha_nacimiento: "1988-09-10", genero: "Mujer", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 3, map: 1, me: 3, especialidad:1, sip: "000000000002",nombre: "Vera", apellidos: "Hoyos", fecha_nacimiento: "1970-08-19", genero: "Mujer", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 4, map: 1, me: 5, especialidad:2, sip: "000000000003",nombre: "Juan", apellidos: "Aguera", fecha_nacimiento: "1997-01-17", genero: "Hombre", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 5, map: 2, me: 0, especialidad:1, sip: "000000000004",nombre: "Felipe", apellidos: "Sanchez", fecha_nacimiento: "1964-04-27", genero: "Hombre", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 6, map: 2, me: 0, especialidad:2, sip: "000000000005",nombre: "Sara", apellidos: "Ramos", fecha_nacimiento: "1999-10-10", genero: "Mujer", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 7, map: 2, me: 4, especialidad:1, sip: "000000000006",nombre: "Javier", apellidos: "Garcia", fecha_nacimiento: "1990-11-10", genero: "Hombre", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
    {id: 8, map: 2, me: 6, especialidad:2, sip: "000000000007",nombre: "Cristina", apellidos: "Gomez", fecha_nacimiento: "1995-12-10", genero: "Mujer", observaciones: "", solicitud: "", respuesta: "", fecha_creacion: "", fecha_asignacion: "", fecha_resolucion: ""},
];
module.exports.expedientes = expedientes; //Exportación de la lista de expedientes con sus respectivas propiedades 
var id_nuevo_Expediente = 9
module.exports.id_nuevo_Expediente = id_nuevo_Expediente

/* duda = si el expediente no tiene asociada una especialidad porque solo tiene medico de atenciòn primaria se debe poner 0??*/