let valorFinal = 0; // Total value of selected services

const durations = {
  banhoDeGel: 1,      // Duration in hours for Banho de Gel
  aplicacaoDeGel: 3,  // Duration in hours for Aplicação em Gel
  manutencao: 1.5,    // Duration in hours for Manutenção
  decoracao: 0,       // No additional duration for Decoração
};

function parseTimeToMinutes(timeStr) {
  // Convert time string (e.g., '09:00') to minutes since midnight
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

document.getElementById('banhoDeGel').addEventListener('change', (ev) => {
  // Update total when Banho de Gel checkbox changes
  if (ev.target.checked) {
    valorFinal += 20;
  } else {
    valorFinal -= 20;
  }
  document.getElementById('valorFinal').innerText = 'R$ ' + valorFinal;
});

document.getElementById('aplicacaoDeGel').addEventListener('change', (ev) => {
  // Update total when Aplicação em Gel checkbox changes
  if (ev.target.checked) {
    valorFinal += 130;
  } else {
    valorFinal -= 130;
  }
  document.getElementById('valorFinal').innerText = 'R$ ' + valorFinal;
});

document.getElementById('manutencao').addEventListener('change', (ev) => {
  // Update total when Manutenção checkbox changes
  if (ev.target.checked) {
    valorFinal += 80;
  } else {
    valorFinal -= 80;
  }
  document.getElementById('valorFinal').innerText = 'R$ ' + valorFinal;
});

document.getElementById('decoracao').addEventListener('change', (ev) => {
  // Update total when Decoração checkbox changes
  if (ev.target.checked) {
    valorFinal += 30;
  } else {
    valorFinal -= 30;
  }
  document.getElementById('valorFinal').innerText = 'R$ ' + valorFinal;
});

function goBackToLogin() {
  // Redirect to login page
  window.location.href = 'login.html';
}

document.getElementById('chooseTimeBtn').addEventListener('click', () => {
  // Validate selections before proceeding to time selection
  const isAnyChecked = 
    document.getElementById('banhoDeGel').checked ||
    document.getElementById('aplicacaoDeGel').checked ||
    document.getElementById('manutencao').checked ||
    document.getElementById('decoracao').checked;
  const selectedDate = document.getElementById('date').value;

  if (!isAnyChecked) {
    alert('Por favor, selecione pelo menos um procedimento.');
    return;
  }
  if (!selectedDate) {
    alert('Por favor, selecione uma data.');
    return;
  }

  let totalDuration = 0;
  if (document.getElementById('banhoDeGel').checked) totalDuration += durations.banhoDeGel;
  if (document.getElementById('aplicacaoDeGel').checked) totalDuration += durations.aplicacaoDeGel;
  if (document.getElementById('manutencao').checked) totalDuration += durations.manutencao;
  if (document.getElementById('decoracao').checked) totalDuration += durations.decoracao;

  // Hide step 1, show step 2
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';

  // Disable times that overlap with total duration (end at 18:00)
  const timeInputs = document.querySelectorAll('input[name="time"]');
  const endTimeMinutes = 18 * 60; // 18:00 in minutes
  timeInputs.forEach((input) => {
    const startMinutes = parseTimeToMinutes(input.value);
    if (startMinutes + totalDuration * 60 > endTimeMinutes) {
      input.disabled = true;
      input.parentElement.style.color = 'gray';
    } else {
      input.disabled = false;
      input.parentElement.style.color = 'black';
    }
  });
});

function goBackToStep1() {
  // Return to step 1 from step 2
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
  // Re-enable all time radios
  const timeInputs = document.querySelectorAll('input[name="time"]');
  timeInputs.forEach((input) => {
    input.disabled = false;
    input.parentElement.style.color = 'black';
  });
}

document.getElementById('confirmBtn').addEventListener('click', () => {
  // Confirm booking and save to localStorage
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

  // Get selected services
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

  // Save to localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  const address = 'Rua dos Guaranis, número 215';
  const professional = 'Fernanda';
  const summary = `Agendamento finalizado!\n\nCliente: ${clientName}\nTelefone: ${clientPhone}\nData: ${selectedDate}\nHorário: ${selectedTime.value}\nServiços: ${services.join(', ')}\nValor: R$ ${valorFinal}\nEndereço: ${address}\nProfissional: ${professional}`;
  alert(summary);

  // Reset form for new booking
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.getElementById('date').value = '';
  document.querySelectorAll('input[name="time"]').forEach(r => r.checked = false);
  valorFinal = 0;
  document.getElementById('valorFinal').innerText = '';
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step1').style.display = 'block';
});
