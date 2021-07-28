let qs = (element) => document.querySelector(element);

let formulario1 =qs("#crear-cuenta");
let nombreInput = qs("#nombre");
let apellidoInput = qs("#apellido");
let emailInput =qs("#email");
let passwordInput = qs("#password");
let repasswordInput = qs("#repassword");

let errores ={};

let errorGeneral =qs(".error-general");    
let errorNombre =qs(".error-nombre");
let errorApellido =qs(".error-apellido");    
let errorPassword =qs(".error-password");
let errorRepassword =qs(".error-repassword");    
let errorEmail =qs(".error-email");


function validar() {

    let expresionRegular1= /\d/g; //expresion regular busca cualquier numero entre 0-9
    let expresionRegular2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&-])([A-Za-z\d$@$!%*?&-]|[^ ]){8,15}$/;//validar contraseña: 
    let expresionRegular3 =/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i; //validar email

    /**-----------Validacion Todos los campos vacios------------ */
    if(nombreInput.value=="" && apellidoInput.value=="" && passwordInput.value=="" && repasswordInput.value=="" && emailInput.value==""){
        errores.general = "Por favor ingrese los datos";
    }
    
    /**-----------Validacion Nombre------------ */
    if(nombreInput.value==""){
        errores.nombre ="Debe insertar nombre";
    }else if(expresionRegular1.test(nombreInput.value)){ 
        errores.nombre ="El nombre no debe contener numeros";
    }else if(nombreInput.value.length<3){
        errores.nombre ="Nombre debe tener minimo 3 letras";
    }

    /**-----------Validacion Apellido------------ */
    if(apellidoInput.value==""){
        errores.apellido ="Debe insertar apellido";
    }else if(expresionRegular1.test(apellidoInput.value)){ 
        errores.apellido = "El apellido no debe contener numeros";
    }else if(apellidoInput.value.length<3){
        errores.apellido ="Apellido debe tener minimo 3 letras";
    }   
    
    /**-----------Validacion Contraseña------------ */
    if(expresionRegular2.test(passwordInput.value)){
        console.log("Contraseña correcta")
    }else{
        errores.password = ["Minimo 8 caracteres- Maximo 15", "Al menos una letra mayúscula", "Al menos una letra minuscula", "Al menos un dígito", "No espacios en blanco", "Al menos 1 caracter especial"];
    }

    if(repasswordInput.value==""){
        errores.repassword = "Repetir contraseña";
    }else if(repasswordInput.value !== passwordInput.value){
        errores.repassword = "Contraseña incorrecta";
    }
    

    /**-----------Validacion Email------------ */
    
    if(expresionRegular3.test(emailInput.value)){ 
        console.log("correo valido");
    }else if(emailInput.value==""){
        errores.email ="Debe ingresar correo";
    }else{
        errores.email ="Formato de correo no valido";
    }
    
    /*-------Mostrar mensajes de error--------*/

    if (errores.general!=undefined){
        errorGeneral.innerHTML = `<i class="fas fa-exclamation-triangle"></i><small>${errores.general}</small>`
        errorGeneral.classList.add("show"); 
        }
        else if (errores.nombre!=undefined){
        errorNombre.innerHTML = `<i class="fas fa-exclamation-triangle"></i><small>${errores.nombre}</small>`
        errorNombre.classList.add("show"); 
       }
        else if (errores.apellido!=undefined){
        errorApellido.innerHTML = `<i class="fas fa-exclamation-triangle"></i><small>${errores.apellido}</small>`
        errorApellido.classList.add("show"); 
       }
        else if (errores.password!=undefined){
        errorPassword.innerHTML = `<i class="fas fa-exclamation-triangle"></i><small>La contraseña debe tener: 
        <ul><li>${errores.password[0]}</li>
        <li>${errores.password[1]}</li>
        <li>${errores.password[2]}</li>
        <li>${errores.password[3]}</li>
        <li>${errores.password[4]}</li>
        <li>${errores.password[5]}</li></ul></small>`
        errorPassword.classList.add("show"); 
       }
       else if (errores.repassword!=undefined){
        errorRepassword.innerHTML = `<i class="fas fa-exclamation-triangle"></i><small>${errores.repassword}</small>`
        errorRepassword.classList.add("show"); 
       }
       else if (errores.email!=undefined){
        errorEmail.innerHTML = `<i class="fas fa-exclamation-triangle"></i><small>${errores.email}</small>`
        errorEmail.classList.add("show"); 
       }

}
    

formulario1.addEventListener("submit",function(e){
    e.preventDefault(); 

    /*---------Limpiar valores iniciales--------*/
    errores={};
    errorGeneral.classList.remove("show");
    errorNombre.classList.remove("show");
    errorApellido.classList.remove("show");
    errorPassword.classList.remove("show");
    errorRepassword.classList.remove("show");
    errorEmail.classList.remove("show"); 

    validar(); 

    let datos = {firstName:nombreInput.value , lastName:apellidoInput.value , email:emailInput.value , password:passwordInput.value };

    let setting = {
        "method": "POST",
        "headers": {
            "content-type":"application/json"
        },
        "body": JSON.stringify(datos)
    }
    
    /*------------Se envia solo si no hay errores-------------*/
    if (Object.keys(errores).length === 0 ){
        fetch("https://ctd-todo-api.herokuapp.com/v1/users",setting)
        .then(function(response){
            return response.json();
        })
        .then(function(info){
            sessionStorage.setItem("token",info.jwt);
            window.location.href = "lista-tareas.html"
        })
        .catch(function(e){
            console.log("Error: "+ e);
        })
    } 

})

