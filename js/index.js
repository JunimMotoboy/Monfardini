let valorFinal = 0; 
const durations = {
  banhoDeGel: 1,     
  aplicacaoDeGel: 3,  
  manutencao: 1.5,  
  decoracao: 0,     
};
const queryString = window.location.search;
const searchParams = new URLSearchParams(queryString);
const cargo = searchParams.get('cargo');
console.log(cargo)

function parseTimeToMinutes(timeStr) {
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}



function goBackToLogin() {
  
  window.location.href = 'login.html';
}



function goBackToStep1() {
  
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
  
  const timeInputs = document.querySelectorAll('input[name="time"]');
  timeInputs.forEach((input) => {
    input.disabled = false;
    input.parentElement.style.color = 'black';
  });
}

document.getElementById('confirmBtn').addEventListener('click', () => {
  
  const selectedTime = document.querySelector('input[name="time"]:checked');
  const clientName = localStorage.getItem('clientName');
  const clientPhone = localStorage.getItem('clientPhone');
  const selectedDate = document.getElementById('date').value;

  if (!selectedTime) {
    alert('Por favor, selecione um horário.');
    return;
  }
  if (!clientName) {
    alert('Por favor, faça o cadastro primeiro.');
    window.location.href = 'register.html';
    return;
  }

 
  const services = [];
  if (document.getElementById('banhoDeGel').checked) services.push('Banho de Gel');
  if (document.getElementById('aplicacaoDeGel').checked) services.push('Aplicação em Gel');
  if (document.getElementById('manutencao').checked) services.push('Manutenção');
  if (document.getElementById('decoracao').checked) services.push('Decoração');

  const booking = {
    id: Date.now(),
    name: clientName,
    phone: clientPhone,
    date: selectedDate,
    time: selectedTime.value,
    services: services,
    value: valorFinal
  };

 
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  const address = 'Rua dos Guaranis, número 215';
  const professional = 'Fernanda';
  const summary = `Agendamento finalizado!\n\nCliente: ${clientName}\nTelefone: ${clientPhone}\nData: ${selectedDate}\nHorário: ${selectedTime.value}\nServiços: ${services.join(', ')}\nValor: R$ ${valorFinal}\nEndereço: ${address}\nProfissional: ${professional}`;
  alert(summary);

  
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById('date').value = '';
  document.querySelectorAll('input[name="time"]').forEach(r => r.checked = false);
  valorFinal = 0;
  document.getElementById('valorFinal').innerText = '';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
});


const procedimentosDiv = document.getElementById('box-card')

async function carregarProcedimentos (){
  const res= await fetch (`https://api-monfardini.onrender.com/procedimentos/${cargo}`)
  const data = await res.json()
  data.forEach(procedimento => {
    var div = document.createElement('div')
    div.innerHTML = ` <div class="card">
        <label for="banhoDeGel"><input type="checkbox" id="${procedimento.id}"> ${procedimento.procedimento}</label>
      </div> `
      procedimentosDiv.appendChild(div)
  })
  console.log(data)
}


carregarProcedimentos()