
const form = document.querySelector('form');
const email = document.querySelector('input[type=text]');
const password = document.querySelector('input[type=password]');


form.addEventListener('submit',onSubmition);
const onSubmition = (event)=>{
    if(email.value === "" || password.value === ""){
        event.preventDefault(); //for preventing the page refresh
        alert("Plear fill the form");
        return false; //this false for break the action
    }

}
