"use strict";


///////////////
///////// FUNCTIONS
//////////


// Gestion de formulario
function gestionFormularios(oEvento){
    let oE = oEvento || window.event;
    
    ocultarFormularios();
  
    inicializarSelectsFormularios();
  
    switch(oE.target.id){
      case 'mnuAltaPrestamo':
        frmAltaPrestamo.style.display = "block";
        break; 
      case 'mnuDevolverPrestamo':
        frmDevolverPrestamo.style.display = "block";
        break;
      case 'mnuAltaUsuario':
        frmAltaUsuario.style.display = "block";
        break;
      case 'mnuAltaArticulo':
        frmAltaArticulo.style.display = "block";
        break;
      case 'mnuListadoPrestamo':
        frmListadoPrestamoFecha.style.display="block";
        break;
      case 'mnuListadoPrestamoUsuario':
        frmListadoPrestamoUsuario.style.display="block";
        break;
      case 'mnuListadoTipoArticulos':
        frmListadoArticuloTipo.style.display="block";
        break;
    }
}

function inicializarSelectsFormularios(){
        frmAltaPrestamo.lstUsuarios.innerHTML = oBiblioteca.optionsUsuarios();   
        frmAltaPrestamo.lstLibros1.innerHTML = oBiblioteca.optionsLibros();
        frmAltaPrestamo.lstLibros2.innerHTML = frmAltaPrestamo.lstLibros1.innerHTML;
        frmAltaPrestamo.lstDVD1.innerHTML = oBiblioteca.optionsDVD();
        frmAltaPrestamo.lstDVD2.innerHTML = frmAltaPrestamo.lstDVD1.innerHTML;
  
        frmDevolverPrestamo.selectPrestamoDevolver.innerHTML = oBiblioteca.optionsPrestamos();
        frmListadoPrestamoUsuario.selectListadoPrestamoUsuario.innerHTML = oBiblioteca.optionsUsuarioListado();
}


function aceptarAltaPrestamo(){

    if (validarAltaPrestamo()){
        // Construir un objeto prestamo
        let idPrestamo = oBiblioteca.generarId('Prestamo');
      
        let oArticulos = [];
        if (parseInt(frmAltaPrestamo.lstLibros1.value.trim()) != -1 ){
            oArticulos.push(oBiblioteca.buscarArticuloPorId(parseInt(frmAltaPrestamo.lstLibros1.value)));
        }
        if (parseInt(frmAltaPrestamo.lstLibros2.value.trim()) != -1 ){
            oArticulos.push(oBiblioteca.buscarArticuloPorId(parseInt(frmAltaPrestamo.lstLibros2.value)));
        }
        if (parseInt(frmAltaPrestamo.lstDVD1.value.trim()) != -1 ){
            oArticulos.push(oBiblioteca.buscarArticuloPorId(parseInt(frmAltaPrestamo.lstDVD1.value)));
        }
        if (parseInt(frmAltaPrestamo.lstDVD2.value.trim()) != -1 ){
            oArticulos.push(oBiblioteca.buscarArticuloPorId(parseInt(frmAltaPrestamo.lstDVD2.value)));
        }
      
        // Usuario
        let idUsuario = parseInt(frmAltaPrestamo.lstUsuarios.value.trim());
        let oUsuario = oBiblioteca.buscarUsuario(idUsuario);

        // Construyo el objeto
        let oPrestamo = new Prestamo(idPrestamo,oArticulos,oUsuario,new Date(),null);


        let sResultado = oBiblioteca.altaPrestamo(oPrestamo);
        mensajeModal("Prestamo añadido", sResultado);
        
        frmAltaPrestamo.reset();
        inicializarSelectsFormularios()
    }

}


function aceptarDevolverPrestamo(){
    let idPrestamoDevolver = parseInt(frmDevolverPrestamo.selectPrestamoDevolver.value.trim());
  
    if(idPrestamoDevolver == -1){
      mensajeModal('Prestamos', 'Error: debe seleccionar un prestamo');
    }
  
    else{
      let resultado = oBiblioteca.devolverPrestamo(idPrestamoDevolver);
      mensajeModal("Prestamos", resultado);
  
      frmDevolverPrestamo.reset();
      inicializarSelectsFormularios();
    }
 

}


function aceptarAltaUsuario()
{
    let idUsuario = oBiblioteca.generarId('Usuario');
    let sNombre= frmAltaUsuario.txtNombre.value.trim();
    let sApellidos=frmAltaUsuario.txtApellidos.value.trim();
  
    let iTelefono=frmAltaUsuario.txtTelefono.value.trim();
  
    let oUsuario;
  
    if(sNombre.length==0 || sApellidos.length==0 || iTelefono.length==0){
        mensajeModal("Error", "Faltan datos por rellenar");
    }
  
    else if(isNaN(iTelefono))
    {
      mensajeModal("Error", "El campo de teléfono debe contener un número");
    }
    else
    {
        oUsuario= new Usuario(idUsuario, sNombre, sApellidos, iTelefono);   
        mensajeModal("Usuario Añadido", oBiblioteca.altaUsuario(oUsuario));
        frmAltaUsuario.reset();
    }    

}


function validarAltaPrestamo(){
    let idUsuario = parseInt(frmAltaPrestamo.lstUsuarios.value.trim());

    if(parseInt(frmAltaPrestamo.lstUsuarios.value.trim()) == -1){
        mensajeModal("Error", 'debe seleccionar un usuario');
      return false;
    }
    
    let hayArticulo = false;
  
    let arraySelects = [
      parseInt(frmAltaPrestamo.lstLibros1.value),
      parseInt(frmAltaPrestamo.lstLibros2.value),
      parseInt(frmAltaPrestamo.lstDVD1.value),
      parseInt(frmAltaPrestamo.lstDVD2.value)
    ];
  
    for(let valorSelect of arraySelects){
      if(valorSelect != -1){
        hayArticulo = true;
      }
    }
  
    if(!hayArticulo){
      mensajeModal("Error", 'debe seleccionar al menos un articulo');
      return false;
    }

    else if((arraySelects[0] == arraySelects[1] && arraySelects[0] != -1) || (arraySelects[2] == arraySelects[3] && arraySelects[2] != -1)){
      mensajeModal("Error", 'no puedes seleccionar dos veces el mismo articulo');
      return false;
    }
  
    return true;
  
}

function mostrarCamposArticulos(radioSeleccionado){
  let camposMostrar;
  let camposOcultar;
  
  if(radioSeleccionado.value == 'DVD'){
    //camposDVD
    camposMostrar = document.querySelectorAll('.camposDVD');
    camposOcultar = document.querySelectorAll('.camposLibro');
    
    for(let campo of camposMostrar){
      campo.style.display = 'block';
    }
    
    for(let campo of camposOcultar){
      campo.style.display = 'none';
    }
  }
  else if(radioSeleccionado.value = 'Libro'){
    //camposLibro
    camposMostrar = document.querySelectorAll('.camposLibro');
    camposOcultar = document.querySelectorAll('.camposDVD');
    
    for(let campo of camposMostrar){
      campo.style.display = 'block';
    }
    
    for(let campo of camposOcultar){
      campo.style.display = 'none';
    }
  }
}

function ocultarFormularios(){
  let formularios = document.querySelectorAll('#formularios form');
  
  for(let formulario of formularios){
    formulario.style.display='none';
  }
}







function aceptarAltaArticulo(){

  let radioTipo = frmAltaArticulo.radioTipo.value;
  let titulo = frmAltaArticulo.tituloArticulo.value;
  
  let autor = frmAltaArticulo.autorArticulo.value;
  let numPag = frmAltaArticulo.numPaginas.value;
  
  let fechaEstr = frmAltaArticulo.fechaEstreno.value;
  let radioSubtitulado = frmAltaArticulo.radioSub.value;
 
  
  if(titulo && radioTipo){
      if(radioTipo == 'Libro'){
          if(autor && !isNaN(numPag)){
              return true;
          }
          else{
              mensajeModal('Error', 'Debes escribir un autor y un número de páginas');
              return false;
          }
      }
    
      else if(radioTipo == 'DVD'){
          if(fechaEstr && radioSubtitulado ){
              return true;
          }
      
          else{
              mensajeModal('Error', 'Debes introducir una fecha de estreno y marcar si está subtitulado');
              return false;
          }
      }
  }
  
  else{
    mensajeModal('Error', 'Debes seleccionar una opción y escribir un título');
    return false;
  }
} 
  
  
  
  function darAltaArticulo(){
      if(aceptarAltaArticulo()){
            let idArt = oBiblioteca.generarId('Articulo');
  
            let radioTipo = frmAltaArticulo.radioTipo.value;
            let titulo = frmAltaArticulo.tituloArticulo.value;
  
            let autor = frmAltaArticulo.autorArticulo.value;
            let numPag = parseInt(frmAltaArticulo.numPaginas.value);
  
            let fechaEstr = frmAltaArticulo.fechaEstreno.value;
            let radioSubtitulado = frmAltaArticulo.radioSub.value;
        
            if(radioTipo == 'DVD'){
                let oArticulo = new DVD(idArt, titulo, fechaEstr, radioSubtitulado);
                let mens = oBiblioteca.altaArticulo(oArticulo);
                mensajeModal("Gestión de artículos", mens); 
               
            }
            else{
                let oArticulo = new Libro(idArt, titulo, autor, numPag);
                let mens = oBiblioteca.altaArticulo(oArticulo);
                mensajeModal("Gestión de artículos", mens); 
            }
        
        //borrar campos
        ocultarCamposAltaArticulo();
      }  
  }
  
  
  function ocultarCamposAltaArticulo(){
      document.querySelector('#frmAltaArticulo').reset();
      let camposOcultar = document.querySelectorAll('.camposLibro, .camposDVD');

      for(let campo of camposOcultar){
          campo.style.display = 'none';
      }
  }
  
  
  



////////////
///LISTADOS
///////////

function imprimirTablaUsuario() {
  var oUsuario = {
    titulo: "Listado Usuario",

    tabla: oBiblioteca.listadoUsuarios()
  };

  let sUsuario = JSON.stringify(oUsuario);

  let sURL = encodeURI("Plantilla.html?plantilla=" + sUsuario);

  let oVentana = open(sURL, "_blank");
}

function imprimirTablaArticulo() {
  var oArticulo = {
    titulo: "Listado Artículos",

    tabla: oBiblioteca.listadoArticulos()
  };

  let sArticulo = JSON.stringify(oArticulo);

  let sURL = encodeURI("Plantilla.html?plantilla=" + sArticulo);

  let oVentana = open(sURL, "_blank");
}

function imprimirTablaPrestamosFecha()
{
  
  var oPrestamo = {
    titulo: "Listado Préstamo por Fechas",

    tabla: oBiblioteca.listadoPrestamos(frmListadoPrestamoFecha.fechaInicio.value, frmListadoPrestamoFecha.fechaFin.value)
  };

  let sPrestamo = JSON.stringify(oPrestamo);

  let sURL = encodeURI("Plantilla.html?plantilla=" + sPrestamo);

  let oVentana = open(sURL, "_blank");
  frmListadoPrestamoFecha.reset();
}


function imprimirTablaPrestamoUsuario()
{

  var oPrestamo = {
    titulo: "Listado Préstamos por Usuarios",

    tabla: oBiblioteca.listadoPrestamosUsuarios(frmListadoPrestamoUsuario.selectListadoPrestamoUsuario.value)
  };

  let sPrestamo = JSON.stringify(oPrestamo);

  let sURL = encodeURI("Plantilla.html?plantilla=" + sPrestamo);

  let oVentana = open(sURL, "_blank");
  
  frmListadoPrestamoUsuario.reset();
  
  
}

function imprimirTipoArticulo()
{
    var oArticulo = {
    titulo: "Listado Artículos por Tipos",

    tabla: oBiblioteca.listadoTipoArticulo(frmListadoArticuloTipo.selectListadoPorTipo.value)
  };

  let sArticulo = JSON.stringify(oArticulo);

  let sURL = encodeURI("Plantilla.html?plantilla=" + sArticulo);

  let oVentana = open(sURL, "_blank");
  
}



/*
#######
###  MENSAJES MODALES
#####
*/
function mensajeModal(titulo, mensaje){
  
  document.querySelector("#bstModalLabel").innerHTML= titulo;
  document.querySelector("#btsModalBody").innerHTML= mensaje;
  myModal.show();
  
}

function btsBotonModalPulsado(){

    myModal.hide()
  
}



///////////////
///////// MAIN
//////////
// Variables globales
var oBiblioteca = new Biblioteca();


//Modal
var myModal = new bootstrap.Modal(document.getElementById('myModal'));




// Registro de eventos del menú
document.querySelector("#mnuAltaPrestamo").addEventListener("click",gestionFormularios);
document.querySelector("#mnuDevolverPrestamo").addEventListener("click",gestionFormularios);
document.querySelector("#mnuAltaUsuario").addEventListener("click",gestionFormularios);
document.querySelector("#mnuAltaArticulo").addEventListener("click",gestionFormularios);
document.querySelector("#mnuListadoPrestamo").addEventListener("click", gestionFormularios);
document.querySelector("#mnuListadoPrestamoUsuario").addEventListener("click", gestionFormularios);
document.querySelector("#mnuListadoTipoArticulos").addEventListener("click", gestionFormularios);


document.querySelector("#mnuListadoUsuario").addEventListener("click", imprimirTablaUsuario);
document.querySelector("#mnuListadoArticulo").addEventListener("click", imprimirTablaArticulo);
document.querySelector("#btnFiltrarPorFecha").addEventListener("click", imprimirTablaPrestamosFecha);
document.querySelector("#btnListadoPrestamoUsuario").addEventListener("click", imprimirTablaPrestamoUsuario);
document.querySelector("#btnListadoArticuloTipo").addEventListener("click", imprimirTipoArticulo);



//mnuListadoPrestamoUsuario

// frmAltaArticulo.radio.value btsBotonModal
document.querySelector("#btnAltaArticulo").addEventListener("click", darAltaArticulo);
document.querySelector("#btsBotonModal").addEventListener("click", btsBotonModalPulsado);

let btnAltaUsuario=document.querySelector('#btnAceptarAltaUsuario');
btnAltaUsuario.addEventListener('click', aceptarAltaUsuario,false);

document.querySelector("#btnAceptarAltaPrestamo").addEventListener("click",aceptarAltaPrestamo, false);
document.querySelector("#btnDevolverPrestamo").addEventListener("click", aceptarDevolverPrestamo);  
  
