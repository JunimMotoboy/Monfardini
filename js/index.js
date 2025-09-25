var valorFinal = 0

const durations = {
  banhoDeGel: 1,
  aplicacaoDeGel: 3,
  manutencao: 1.5,
  decoracao: 0,
}

function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

document.getElementById('banhoDeGel').addEventListener('click', (ev) => {
  if (ev.target.checked) {
    valorFinal = valorFinal + 20
  } else {
    valorFinal = valorFinal - 20
  }
  document.getElementById('valorFinal').innerText = 'R$  ' + valorFinal
})

document.getElementById('aplicacaoDeGel').addEventListener('click', (ev) => {
  if (ev.target.checked) {
    valorFinal = valorFinal + 130
  } else {
    valorFinal = valorFinal - 130
  }
  document.getElementById('valorFinal').innerText = 'R$  ' + valorFinal
})

document.getElementById('manutencao').addEventListener('click', (ev) => {
  if (ev.target.checked) {
    valorFinal = valorFinal + 80
  } else {
    valorFinal = valorFinal - 80
  }
  document.getElementById('valorFinal').innerText = 'R$  ' + valorFinal
})

document.getElementById('decoracao').addEventListener('click', (ev) => {
  if (ev.target.checked) {
    valorFinal = valorFinal + 30
  } else {
    valorFinal = valorFinal - 30
  }
  document.getElementById('valorFinal').innerText = 'R$  ' + valorFinal
})

function goBackToLogin() {
  window.location.href = 'login.html'
}

document.getElementById('chooseTimeBtn').addEventListener('click', () => {
  const isAnyChecked =
    document.getElementById('banhoDeGel').checked ||
    document.getElementById('aplicacaoDeGel').checked ||
    document.getElementById('manutencao').checked ||
    document.getElementById('decoracao').checked
  if (!isAnyChecked) {
    alert('Por favor, selecione pelo menos um procedimento.')
    return
  }

  let totalDuration = 0
  if (document.getElementById('banhoDeGel').checked)
    totalDuration += durations.banhoDeGel
  if (document.getElementById('aplicacaoDeGel').checked)
    totalDuration += durations.aplicacaoDeGel
  if (document.getElementById('manutencao').checked)
    totalDuration += durations.manutencao
  if (document.getElementById('decoracao').checked)
    totalDuration += durations.decoracao

  document.getElementById('step1').style.display = 'none'
  document.getElementById('step2').style.display = 'block'

  const timeInputs = document.querySelectorAll('input[name="time"]')
  const endTimeMinutes = 18 * 60 // 18:00 in minutes
  timeInputs.forEach((input) => {
    const startMinutes = parseTimeToMinutes(input.value)
    if (startMinutes + totalDuration * 60 > endTimeMinutes) {
      input.disabled = true
      input.parentElement.style.color = 'gray'
    } else {
      input.disabled = false
      input.parentElement.style.color = 'black'
    }
  })
})

function goBackToStep1() {
  document.getElementById('step2').style.display = 'none'
  document.getElementById('step1').style.display = 'block'
  // Re-enable all time radios
  const timeInputs = document.querySelectorAll('input[name="time"]')
  timeInputs.forEach((input) => {
    input.disabled = false
    input.parentElement.style.color = 'black'
  })
}

document.getElementById('confirmBtn').addEventListener('click', () => {
  const selectedTime = document.querySelector('input[name="time"]:checked')
  const clientName = localStorage.getItem('clientName')
  if (!selectedTime) {
    alert('Por favor, selecione um horário.')
    return
  }
  if (!clientName) {
    alert('Por favor, faça o cadastro primeiro.')
    window.location.href = 'register.html'
    return
  }
  const address = 'Rua dos Guaranis, número 215'
  const professional = 'Fernanda'
  const summary = `Agendamento finalizado!\n\nCliente: ${clientName}\nHorário: ${selectedTime.value}\nEndereço: ${address}\nProfissional: ${professional}`
  alert(summary)
})
