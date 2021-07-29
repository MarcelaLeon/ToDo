/*--------------------------------------------*/

function formatoFecha(fecha){
	let dia = fecha.slice(8,10);
    let mes = fecha.slice(5,7);;
	let anio = fecha.slice(0,4);
	let fechaForm = `${ dia }/${ mes }/${ anio }`;
    return fechaForm;
}

//let date = nuevaTarea.createdAt.slice(2,10).replace(/-/g,"/")

/**----------------------------------------- */

let qs = (element) => document.querySelector(element);
let tareasPendientes = qs(".tareas-pendientes");
let tareasTerminadas = qs(".tareas-terminadas")

function renderizarDatos(listaTareas) {
    tareasPendientes.innerHTML ="";
    tareasTerminadas.innerHTML ="";

    listaTareas.forEach(tarea =>{ 
        let fecha = formatoFecha(tarea.createdAt);  
        if(tarea.completed){ 
            tareasTerminadas.innerHTML += `
            <li class="tarea" data-id="${tarea.id}" data-completada="${tarea.completed}">
                <div class="toggle"></div>
                <div class="descripcion">
                    <p class="nombre">${tarea.description}</p>
                    <p class="timestamp">Creada: ${fecha}</i></p>
                    
                </div>
                <i class="far fa-trash-alt"></i>
            </li>`
       }else{ tareasPendientes.innerHTML += `
       <li class="tarea" data-id="${tarea.id}" data-completada="${tarea.completed}">
           <div class="toggle"></div>
           <div class="descripcion">
               <p class="nombre">${tarea.description}</p>
               <p class="timestamp">Creada: ${fecha} <i class="fas fa-pencil-alt"></i></p>    
           </div>
           <i class="far fa-trash-alt"></i>
       </li>`
        
    }
    })
}


/*-------Token para renderizar las tareas luego de logearme--------*/

let autorizacion= sessionStorage.getItem("token");


/**----------------Renderizar tareas al logearme------------------------------*/

let setting = {
    "headers": {
        "Authorization":autorizacion,
        "content-type":"application/json"
    }
}

/** Get - obtener tarea y rederizar */

function cargarTareas() {
    fetch("https://ctd-todo-api.herokuapp.com/v1/tasks",setting)
    .then(function(response){
        return response.json();
    })
    .then(function(info){
        renderizarDatos(info);
        editarTarea();
        terminarTarea();
        eliminarTarea();

    })
    .catch(function(e){
        console.log("Error: "+ e);
    })   
}


let usuario = qs("#usuario");
function cargarUsuario() {
    fetch ("https://ctd-todo-api.herokuapp.com/v1/users/getMe",setting)
    .then (function(response){
        return response.json()
    })
    .then (function(info){
        usuario.innerText = info.firstName
    })
    
}

//Llamado inicial
cargarTareas(); 
cargarUsuario();


/**------------------Agregar nueva tarea----------------------------*/

function nuevaTarea() {
    let formulario3 =qs(".nueva-tarea");
    formulario3.addEventListener("submit",function(e){
        e.preventDefault();
        let datos3 = {description: qs("#tarea").value, completed: false};
        let setting = {
            "method": "POST",
            "headers": {
                "Authorization":autorizacion,
                "content-type":"application/json"
            },
            "body": JSON.stringify(datos3)
        }
        
        if (datos3 != undefined ){
        fetch("https://ctd-todo-api.herokuapp.com/v1/tasks",setting)
        .then(function(response){
            return response.json();
            })
        .then(function(info){
            cargarTareas();
            })
        .catch(function(e){
            console.log("Error: "+ e);
            })
       }
    })  
}

nuevaTarea(); //Llamado inical para agregar nuevas tareas


/**------------------Pasar tarea a estado teminada----------------------------*/
function terminarTarea() {

    let toggle = document.querySelectorAll(".toggle");
    for(i=0; i<toggle.length; i++){
        toggle[i].addEventListener("click",function (e) {
            e.preventDefault(); 

            Swal.fire({
                title: '¿Quieres cambiar de estado tu tarea?',
                text: "Estas seguro de este cambio",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#8E64C5',
                cancelButtonColor: '#8E64C5',
                confirmButtonText: 'Si, cambiar',
                cancelButtonText: 'No, cancelar'
              }).then((result) => {
                if (result.isConfirmed) {

                    let elementoPadre= e.target.parentElement; //Obtengo el elemento padre
                    let id = elementoPadre.dataset.id; //obtengo el data-atribute del elemento padre
                    let completada = JSON.parse(elementoPadre.dataset.completada);//obtengo el data-atribute del elemento padre
                
                    /** Put - cambiar estado de tarea a completada  (solo se puede cambiar cuando estan cargadas)*/  
                    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`,{
                        "method": "PUT",
                        "headers": {
                            "Authorization":autorizacion,
                            "content-type":"application/json"
                            },
                        "body":JSON.stringify({
                            "completed": !completada 
                            })
                        })
                    .then(function(response){
                        return response.json();
                    })
                    .then(function(info){
                        cargarTareas();
                        Swal.fire({
                            icon: 'success',
                            title: 'Estado de tarea cambiado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                          })
                    })
                    .catch(function(e){
                        console.log("Error: "+ e);
                    })   
                }
              })
        })
    }   
}


/**------------------Editar la descripcion de una tarea----------------------------*/
function editarTarea() {
    let contenedor = qs(".contenedor");
    

    let editar = document.querySelectorAll(".fa-pencil-alt");
    for(i=0; i<editar.length; i++){
        editar[i].addEventListener("click",function (e) {
            e.preventDefault(); 

            let elementoPadre= e.target.parentElement.parentElement.parentElement; //Obtengo el elemento padre
            let id = elementoPadre.dataset.id;
            
            contenedor.classList.add("show");

            let cerrar = qs(".fa-window-close")
            cerrar.addEventListener("click", function () {
                contenedor.classList.remove("show");  
            })

            let botonAceptar =qs("#aceptar");
            botonAceptar.addEventListener("click",function() {
                e.preventDefault();
                if(id!= null){
                let input = qs("#nueva-descripcion").value; 
               
                /** Put - cambiar estado de tarea a completada  (solo se puede cambiar cuando estan cargadas)*/  
                fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`,{
                    "method": "PUT",
                    "headers": {
                        "Authorization":autorizacion,
                        "content-type":"application/json"
                        },
                    "body":JSON.stringify({
                        "description": input
                        })
                    })
                .then(function(response){
                    return response.json();
                    })
                .then(function(info){
                    cargarTareas();
                    id = null
                })
                .catch(function(e){
                    console.log("Error: "+ e);
                }) 

                contenedor.classList.remove("show");
                
                }
            })

            let botonCancelar = qs("#cancelar");
            botonCancelar.addEventListener("click",function (){
                qs("#nueva-descripcion").value = ""; 
                contenedor.classList.remove("show"); 
                
            })
            
        })
    }
    
}


/**------------------Eliminar tarea----------------------------*/
function eliminarTarea() {
    let trash = document.querySelectorAll(".fa-trash-alt");
        for(i=0; i<trash.length; i++){
            trash[i].addEventListener("click",function (e) {
                e.preventDefault(); 

                Swal.fire({
                    title: '¿Quieres eliminar esta tarea?',
                    text: "Estos cambios no podran ser revertidos, ¿estas seguro?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#8E64C5',
                    cancelButtonColor: '#8E64C5',
                    confirmButtonText: 'Si, eliminar',
                    cancelButtonText: 'No, cancelar'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        
                        let elementoPadre= e.target.parentElement; //Obtengo el elemento padre
                        let id = elementoPadre.dataset.id; //obtengo el data-atribute del elemento padre
            
                        /** Delete - borrar tarea  (solo se puede borrar cuando estan cargadas)*/
                        fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`,{
                            "method": "DELETE",
                            "headers": {
                                "Authorization":autorizacion,
                                "content-type":"application/json"
                                }
                            })
                        .then(function(response){
                            return response.json();
                        })
                        .then(function(info){
                            cargarTareas();
                            Swal.fire({
                                icon: 'success',
                                title: 'Tarea eliminada exitosamente',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        })
                        .catch(function(e){
                            console.log("Error: "+ e);
                        })
                    }
                })
            })
        }   
}