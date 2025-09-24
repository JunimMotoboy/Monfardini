var valorFinal = 0;

document.getElementById("banhoDeGel").addEventListener("click", (ev) => {
  if (ev.target.checked) {
    valorFinal = valorFinal + 20;
  }
  else{
    valorFinal = valorFinal - 20;
  }
   document.getElementById("valorFinal").innerText = "R$  " + valorFinal;
});

document.getElementById("aplicacaoDeGel").addEventListener("click", (ev) => {
if(ev.target.checked){
    valorFinal = valorFinal +  130
}
else{
    valorFinal = valorFinal - 130
}
 document.getElementById("valorFinal").innerText = "R$  " + valorFinal;
});

document.getElementById("manutencao").addEventListener("click", (ev) => {
if(ev.target.checked){
    valorFinal = valorFinal + 80 
}
else{
    valorFinal = valorFinal - 80
}
 document.getElementById("valorFinal").innerText = "R$  " + valorFinal;
})


document.getElementById("decoracao").addEventListener("click", (ev) => {
if(ev.target.checked){
    valorFinal = valorFinal + 30
}
else{
    valorFinal = valorFinal - 30
}
 document.getElementById("valorFinal").innerText = "R$  " + valorFinal;
})

function goBackToLogin() {
    window.location.href = 'login.html';
}

document.getElementById("chooseTimeBtn").addEventListener("click", () => {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
});

function goBackToStep1() {
    document.getElementById("step2").style.display = "none";
    document.getElementById("step1").style.display = "block";
}

document.getElementById("confirmBtn").addEventListener("click", () => {
    const selectedTime = document.querySelector('input[name="time"]:checked');
    if (selectedTime) {
        alert(`Horário selecionado: ${selectedTime.value}`);
    } else {
        alert("Por favor, selecione um horário.");
    }
});
