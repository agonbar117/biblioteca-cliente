"use strict";
//////////
/// FUNCTION BIBLIOTECA
//////
function Biblioteca()
{
    this.usuarios = [];
    this.articulos = [];
    this.prestamos = [];
}

Biblioteca.prototype.optionsLibros = function(){

    let sOptions = '<option value="-1">Ninguno</option>';

    for(let articulo of this.articulos){
        if (!articulo.prestado && articulo instanceof Libro){
            sOptions += '<option value="' + articulo.idArticulo + '">' + articulo.titulo + '</option>';
        }
    }

    return sOptions;
}

Biblioteca.prototype.optionsDVD = function(){

    let sOptions = '<option value="-1">Ninguno</option>';

    for(let articulo of this.articulos){ 
        if (!articulo.prestado && articulo instanceof DVD){
            sOptions += '<option value="' + articulo.idArticulo + '">' + articulo.titulo + '</option>';
        }
    }

    return sOptions;
}

Biblioteca.prototype.optionsUsuarios = function(){
    let sOptions = '<option value="-1">Ninguno</option>';
  
    for(let usuario of this.usuarios){
      if(!this.tienePrestamoActivo(usuario.idUsuario)){
        sOptions += '<option value="' + usuario.idUsuario + '">' + usuario.idUsuario + '</option>';        
      }
    }
  
    return sOptions;
}

Biblioteca.prototype.tienePrestamoActivo = function(idUsuarioComprobar){
  let tienePrestamoActivo = false;
  
  for(let prestamo of this.prestamos){
    if(!prestamo.fechaFin && prestamo.usuario.idUsuario == idUsuarioComprobar){
      tienePrestamoActivo = true;
    }
  }
  
  return tienePrestamoActivo;
}

Biblioteca.prototype.optionsPrestamos = function(){
    let sOptions = '<option value="-1">Ninguno</option>';
  
    for(let prestamo of this.prestamos){
      if(!prestamo.fechaFin){
         sOptions += '<option value="' + prestamo.idPrestamo + '">' + prestamo.idPrestamo + '</option>';       
      }

    }
  
    return sOptions;
}

Biblioteca.prototype.optionsUsuarioListado = function(){
  let sOptions = '<option value="-1">Ninguno</option>';
  
  let usuariosConPrestamos = [];
  
  for(let prestamo of this.prestamos){
    if(!usuariosConPrestamos.includes(prestamo.usuario.idUsuario)){
      usuariosConPrestamos.push(prestamo.usuario.idUsuario);
    }
  }
  
  for(let id of usuariosConPrestamos){
    sOptions += '<option value="' + id + '">' + id + '</option>'; 
  }
  
  return sOptions;
}

Biblioteca.prototype.buscarArticuloPorId = function(idArticulo){
  for(let articulo of this.articulos){
    if(articulo.idArticulo == idArticulo){
      return articulo;
    }
  }
  
  return null;
}

Biblioteca.prototype.buscarUsuario = function(idUsuario){
    for(let usuario of this.usuarios){
      if(usuario.idUsuario == idUsuario){
        return usuario;
      }
    }
  
  return null;
}

Biblioteca.prototype.generarId = function(sTipoObjeto){
  switch(sTipoObjeto){
    case 'Usuario':
      return this.usuarios.length+1;
      break;
    case 'Articulo':
      return this.articulos.length+1;
      break;
    case 'Prestamo':
      return this.prestamos.length+1;
      break;
  }
}

Biblioteca.prototype.altaPrestamo = function(oPrestamo){
  //Comprueba que el usuario no tenga un prestamo activo
  for(let prestamo of this.prestamos){
    if(prestamo.usuario.idUsuario == oPrestamo.usuario.idUsuario && !prestamo.fechaFin){
      return 'ERROR: El usuario ya tiene un prestamo activo';
    }
  }

  for(let articulo of oPrestamo.articulos){
    let articuloBiblioteca = this.articulos.find(articuloBuscado => {
      return articuloBuscado.idArticulo == articulo.idArticulo;
    });
    
    articuloBiblioteca.prestado = true;
    articulo = articuloBiblioteca;
    
  }
  
  this.prestamos.push(oPrestamo);
  return 'Prestamo solicitado correctamente';
  
}


Biblioteca.prototype.devolverPrestamo = function(idPrestamo){
  for(let prestamo of this.prestamos){
    if(prestamo.idPrestamo == idPrestamo){
      for(let articulo of prestamo.articulos){
          
          let articuloBiblioteca = this.articulos.find(articuloBuscado => {return articuloBuscado.idArticulo == articulo.idArticulo;});
        
          articuloBiblioteca.prestado = false;
          articulo = articuloBiblioteca;

      }
      
      prestamo.fechaFin = new Date();     
      return 'Artículos devueltos correctamente';
    }
    
  
  }

  return 'ERROR: Prestamo no encontrado';
}

//ALTA USUARIO
Biblioteca.prototype.altaUsuario = function(oUsuario)
{
    let mensaje="";
  
    for(let i=0;i<this.usuarios.length;i++)
      {
        if(this.usuarios[i].idUsuario==oUsuario.idUsuario)
        {
            mensaje="Este Usuario ya existe";
            return mensaje;
        }
        
      }
   
        this.usuarios.push(oUsuario);
        mensaje="Usuario añadido";
  
  return mensaje;
}

//ALTA Articulo
Biblioteca.prototype.altaArticulo = function(oArticulo)
{
    let mensaje="";
  
  
  for(let articulo of this.articulos){
            if(articulo.idArticulo == oArticulo.idArticulo)
        {
            mensaje="Este articulo ya existe";
            return mensaje;
        }
  }
        this.articulos.push(oArticulo);
        mensaje="Articulo añadido";
  
  return mensaje;
}



//LISTADO USUARIOS
Biblioteca.prototype.listadoUsuarios = function ()
{
  let sTablaUsuario="<table class='table table-striped'>";
  sTablaUsuario+="<thead><tr><th>ID Usuario</th><th>Nombre</th><th>Apellidos</th><th>Teléfono</th></tr></thead>";
  sTablaUsuario+="<tbody>";
  for (let i=0;i<this.usuarios.length;i++)
    {
      sTablaUsuario+=this.usuarios[i].toHTMLRow();
    }
  sTablaUsuario+="</tbody></table>";
  
  return sTablaUsuario;
  
  
}

//LISTADO ARTICULO
Biblioteca.prototype.listadoArticulos = function ()
{
  let sTablaArticulo="<table class='table table-striped'>";
  sTablaArticulo+="<thead><tr><th>ID Artículo</th><th>Título</th><th>Tipo</th><th>Autor</th><th>Paginas</th><th>Fecha Estreno</th><th>Subtitulada</th></tr></thead>";
  sTablaArticulo+="<tbody>";
  
  for(let oArticulo of this.articulos)
  {
      if(oArticulo instanceof Libro)
      {
          sTablaArticulo+="<tr><td>"+oArticulo.idArticulo+"</td>";
          sTablaArticulo+="<td>"+oArticulo.titulo+"</td>";
          sTablaArticulo+="<td>Libro</td>";
          sTablaArticulo+="<td>"+oArticulo.autor+"</td>";
          sTablaArticulo+="<td>"+oArticulo.paginas+"</td>";
          sTablaArticulo+="<td>-</td>";
          sTablaArticulo+="<td>-</td></tr>";
          
      }
      else if(oArticulo instanceof DVD)
      {
          sTablaArticulo+="<tr><td>"+oArticulo.idArticulo+"</td>";
          sTablaArticulo+="<td>"+oArticulo.titulo+"</td>";
          sTablaArticulo+="<td>DVD</td>";
          sTablaArticulo+="<td>-</td>";
          sTablaArticulo+="<td>-</td>";
          sTablaArticulo+="<td>"+oArticulo.fechaEstreno+"</td>";
          sTablaArticulo+="<td>"+(oArticulo.subtitulada=="Si"?"SI":"NO")+"</td></tr>";
      
      }
  
  }
  sTablaArticulo+="</tbody></table>";
  return sTablaArticulo;
  
}

//LISTADO PRESTAMOS
Biblioteca.prototype.listadoPrestamos= function (dtFechaInicio, dtFechaFin)
{
  let sTablaPrestamoFecha="<table class='table table-striped'>";
  sTablaPrestamoFecha+="<thead><tr><th>ID Préstamo</th><th>ID Usuario</th><th>Nombre Usuario</th><th>F. Inicio Prest.</th><th>F. Fin Prest.</th><th>Artículo</th></tr></thead>";
  sTablaPrestamoFecha+="<tbody>";
  
   dtFechaInicio=new Date(dtFechaInicio); 
   dtFechaFin= new Date(dtFechaFin);

  
  for(let oPrestamo of this.prestamos)
    {
      
      if(oPrestamo.fechaInicio<=dtFechaFin && (oPrestamo.fechaFin==null ||oPrestamo.fechaFin>=dtFechaInicio))
        {
          for(let oArticulo of oPrestamo.articulos)
            { 
        
          sTablaPrestamoFecha+="<tr>";
          
          sTablaPrestamoFecha+="<td>"+oPrestamo.idPrestamo+"</td>";
            sTablaPrestamoFecha+="<td>"+oPrestamo.usuario.idUsuario+"</td>";
            sTablaPrestamoFecha+="<td>"+oPrestamo.usuario.nombre+"</td>";
              
              let fechaInicioFormateada = oPrestamo.fechaInicio.getDate() + "-" + (oPrestamo.fechaInicio.getMonth() + 1) + "-" + oPrestamo.fechaInicio.getFullYear();
                
              sTablaPrestamoFecha+="<td>"+fechaInicioFormateada+"</td>";
              
              if(oPrestamo.fechaFin==null)
                {
                  sTablaPrestamoFecha+="<td>-</td>";
                }
              else
                {
                  let fechaFinFormateada = oPrestamo.fechaFin.getDate() + "-" + (oPrestamo.fechaFin.getMonth() + 1) + "-" + oPrestamo.fechaFin.getFullYear();
                  sTablaPrestamoFecha+="<td>"+fechaFinFormateada+"</td>";
                } 
          
      
              sTablaPrestamoFecha+="<td>ID: "+oArticulo.idArticulo+", "+oArticulo.titulo+"</td>";
            }
          sTablaPrestamoFecha+="</tr>";
        }
      
    }
  sTablaPrestamoFecha+="</tbody></table>";
  return sTablaPrestamoFecha;
  
}

//LISTADO PRESTAMOS por USUARIO
Biblioteca.prototype.listadoPrestamosUsuarios = function (idUsuario)
{
  
  let sPrestamosUsuarios="<table class='table table-striped'>";
  sPrestamosUsuarios+="<thead><tr><th>ID Prestamo</th><th>ID Usuario</th><th>Usuario</th><th>Id Articulo</th><th>Titulo</th><th>Tipo de Articulo</th><th>Fecha Inicio</th><th>Fecha Fin</th></tr></thead>";
  sPrestamosUsuarios+="<tbody>";
  

  for(let prestamo of  this.prestamos)
  {
    if(prestamo.usuario.idUsuario == idUsuario){
      for(let articulo of  prestamo.articulos){
        sPrestamosUsuarios+="<tr><td>"+prestamo.idPrestamo+"</td>";
        sPrestamosUsuarios+="<td>"+idUsuario+"</td>";
        sPrestamosUsuarios+="<td>"+prestamo.usuario.nombre+"</td>";
        sPrestamosUsuarios+="<td>"+articulo.idArticulo+"</td>";
        sPrestamosUsuarios+="<td>"+articulo.titulo+"</td>";
        sPrestamosUsuarios+="<td>"+articulo.constructor.name+"</td>";
        let fechaFinFormateada = prestamo.fechaInicio.getDate() + "-" + (prestamo.fechaInicio.getMonth() + 1) + "-" + prestamo.fechaInicio.getFullYear();
        sPrestamosUsuarios+="<td>"+fechaFinFormateada+"</td>";
        sPrestamosUsuarios+="<td>"+(prestamo.fechaFin?prestamo.fechaFin:'Prestamo en curso')+"</td></tr>";
       }
      
    }
  
  }
   sPrestamosUsuarios+="</tbody></table>";
  return sPrestamosUsuarios;
  
  
}
////LISTADO ARTICULOS POR TIPOS
Biblioteca.prototype.listadoTipoArticulo = function (sTipoArticulo)
{
     let sTablaTipoArticulo="";
  
   if(sTipoArticulo=="Libro")
     {
        sTablaTipoArticulo+="<table class='table table-striped'>";
        sTablaTipoArticulo+="<thead><tr><th>ID Artículo</th><th>Título</th><th>Autor</th><th>Páginas</th></tr></thead>";
        sTablaTipoArticulo+="<tbody>";
       
       for(let oArticulo of this.articulos)
         {
           
           if(oArticulo instanceof Libro)
             {
               sTablaTipoArticulo+="<tr><td>"+oArticulo.idArticulo+"</td>";
               sTablaTipoArticulo+="<td>"+oArticulo.titulo+"</td>";
               sTablaTipoArticulo+="<td>"+oArticulo.autor+"</td>";
               sTablaTipoArticulo+="<td>"+oArticulo.paginas+"</td></tr>";
               
             }
         }
       sTablaTipoArticulo+="</tbody></table>";
       
     }
  else if(sTipoArticulo=="DVD")
    {
      sTablaTipoArticulo+="<table class='table table-striped'>";
      sTablaTipoArticulo+="<thead><tr><th>ID Artículo</th><th>Título</th><th>Fecha Estreno</th><th>Subtitulada</th></tr></thead>";
      sTablaTipoArticulo+="<tbody>";
      
      for(let oArticulo of this.articulos)
        {
          
          if(oArticulo instanceof DVD)
            {
              sTablaTipoArticulo+="<tr><td>"+oArticulo.idArticulo+"</td>";
               sTablaTipoArticulo+="<td>"+oArticulo.titulo+"</td>";
               sTablaTipoArticulo+="<td>"+oArticulo.fechaEstreno+"</td>";
               sTablaTipoArticulo+="<td>"+(oArticulo.subtitulada=="Si"?"SI":"NO")+"</td></tr>";
            }
        }
      sTablaTipoArticulo+="</tbody></table>";
    }
        
  return sTablaTipoArticulo;
    
}
   
  
//////////
/// CLASS USUARIO
//////
class Usuario
  {
    constructor(iIdUsuario, sNombre, sApellidos, iTelefono)
    {
      this.idUsuario=iIdUsuario;
      this.nombre=sNombre;
      this.apellidos=sApellidos;
      this.telefono=iTelefono;
    }
    
    toHTMLRow()
    {
      let sFila="<tr>";
      sFila+="<td>"+this.idUsuario+"</td>";
      sFila+="<td>"+this.nombre+"</td>";
      sFila+="<td>"+this.apellidos+"</td>";
      sFila+="<td>"+this.telefono+"</td></tr>";  

      return sFila;
    }
  }

//////////
/// CLASS ARTICULO
//////
class Articulo{
    constructor(idArticulo, titulo){
      this.idArticulo = idArticulo;
      this.titulo = titulo;
      this.prestado = false;
    }
  
  toHTMLRow(){
    let fila = '<tr>';
    fila += '<td>'+this.idArticulo+'</td><td>'+this.titulo+'</td>';
    fila += '</tr>';
    
    return fila;
  }
}
  
//////////
/// CLASS PRESTAMO
//////
class Prestamo{
    constructor(idPrestamo, articulos, usuario, fechaInicio, fechaFin){
      this.idPrestamo = idPrestamo;
      this.articulos = articulos;
      this.usuario = usuario;
      this.fechaInicio = fechaInicio;
      this.fechaFin = fechaFin;
    }
  
    toHTMLRow(){
      let fila = '<tr>';
      fila += '<td>'+this.idPrestamo+'</td><td>'+this.articulos+'</td><td>'+this.usuario+'</td><td>'+this.fechaInicio+'</td><td>'+this.fechaFin+'</td>';
      fila += '</tr>';
    
      return fila;
    }
}

  
  
  
//////////
//  extends Articulo
/// CLASS LIBRO
//////
class Libro extends Articulo{
    constructor(idArticulo, titulo, nombre, integer){
      super(idArticulo, titulo);
      this.autor= nombre;
      this.paginas = integer;
      
    }
  
      toHTMLRow(){
      let sFila="<tr>";
      sFila+="<td>"+this.idArticulo+"</td>";
      sFila+="<td>"+this.titulo+"</td>";
      sFila+="<td>"+this.autor+"</td>";
      sFila+="<td>"+this.paginas+"</td>";
      sFila+="</tr>";  

      return sFila;
    }
}


//////////
//  extends Articulo
/// CLASS DVD
//////
class DVD extends Articulo{
    constructor(idArticulo, titulo, date, boolean){
      super(idArticulo, titulo);
      this.fechaEstreno= date;
      this.subtitulada = boolean;
      
    }
  
    toHTMLRow(){
      let sFila="<tr>";
      sFila+="<td>"+this.idArticulo+"</td>";
      sFila+="<td>"+this.titulo+"</td>";
      sFila+="<td>"+this.fechaEstreno+"</td>";
      sFila+="<td>"+this.subtitulada+"</td>";
      sFila+="</tr>";  

      return sFila;
    }
}
  