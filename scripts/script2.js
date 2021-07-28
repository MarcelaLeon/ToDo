let qs = (element) => document.querySelector(element);

let formulario2 = qs("#login");

let errorVacio =qs(".error-vacio");
let error =qs(".error");

let datos2;
let authorization;

formulario2.addEventListener("submit",function(e){
    e.preventDefault();

    /*---------Limpiar valores iniciales--------*/
    errorVacio.classList.remove("show");
    error.classList.remove("show")
    
    let emailInput =qs("#email-login").value;
    let passwordInput = qs("#password-login").value;    
    
    datos2 = {email:emailInput , password:passwordInput};

    if(emailInput=="" && passwordInput==""){
        errorVacio.classList.add("show")
    }

    let setting = {
        "method": "POST",
        "headers": {
            "content-type":"application/json"
        },
        "body": JSON.stringify(datos2)
    }
    
    /*------------Se envia con los campos llenos------------*/
    if (emailInput!=="" || passwordInput!==""){

        fetch("https://ctd-todo-api.herokuapp.com/v1/users/login",setting)
        .then(function(response){
            return response.json();
        })
        .then(function(info){
            sessionStorage.setItem("token",info.jwt);
            if(info.jwt == undefined){
                error.classList.add("show") //Si no devuelve el token muetra error de usuario incorrecto
            }
            else{
                window.location.href = "lista-tareas.html"
            }    
        })
        .catch(function(e){
            console.log("Error: "+ e);
        })
   } 

})





