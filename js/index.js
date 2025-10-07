// Impede seleção de datas passadas no input de data
document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('date')
  if (dateInput) {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const minDate = `${yyyy}-${mm}-${dd}`
    dateInput.setAttribute('min', minDate)
  }
})
let valorFinal = 0
const durations = {
  banhoDeGel: 1,
  aplicacaoDeGel: 3,
  manutencao: 1.5,
  decoracao: 0,
}
const queryString = window.location.search
const searchParams = new URLSearchParams(queryString)
const cargo = searchParams.get('cargo')
const name = searchParams.get('name')
console.log(cargo)
console.log(name)

function goBackToLogin() {
  window.location.href = 'login.html'
}
const procedimentosDiv = document.getElementById('box-card')

async function carregarProcedimentos() {
  const res = await fetch(
    `https://api-monfardini.onrender.com/procedimentos/${cargo}`
  )
  const data = await res.json()
  data.forEach((procedimento) => {
    var div = document.createElement('div')
    div.innerHTML = ` 
      <div class="card">
        <label>
          <input type="checkbox" id="${procedimento.id}" value="${procedimento.valor}">
          ${procedimento.procedimento} 
        </label>
      </div> 
    `
    procedimentosDiv.appendChild(div)
  })
  procedimentosDiv.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const checkbox = e.target
      const valor = Number(checkbox.value)

      if (checkbox.checked) {
        valorFinal += valor
      } else {
        valorFinal -= valor
      }

      document.getElementById(
        'valorFinal'
      ).innerText = `R$ ${valorFinal.toFixed(2)}`
    }
  })
  console.log(data)
}

carregarProcedimentos()

const horariosDiv = document.getElementById('timeOpt')

async function carregarHorarios() {
  const res = await fetch('https://api-monfardini.onrender.com/horarios')
  const data = await res.json()
  // Limpa antes de adicionar
  horariosDiv.innerHTML = ''
  data.forEach((horario) => {
    var label = document.createElement('label')
    label.className = 'time-radio-label'
    label.htmlFor = horario.id
    label.innerHTML = `
      <input type="radio" name="time" id="${horario.id}" value="${horario.horario}" />
      <span class="time-radio-span">${horario.horario}</span>
    `
    horariosDiv.appendChild(label)
  })
}
carregarHorarios()

function goToStep2() {
  const selectedServices = document.querySelectorAll(
    '#box-card input[type="checkbox"]:checked'
  )
  const selectedDate = document.getElementById('date').value

  if (selectedServices.length === 0) {
    alert(
      'Por favor, selecione pelo menos um serviço antes de escolher o horário.'
    )
    return
  }

  if (!selectedDate) {
    alert('Por favor, selecione uma data.')
    return
  }
  // Validação extra para garantir que não selecione datas passadas
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selected = new Date(selectedDate)
  if (selected < today) {
    alert('Não é possível agendar para datas que já passaram.')
    return
  }

  document.getElementById('step1').style.display = 'none'
  document.getElementById('step2').style.display = 'block'
}

function goBackToStep1() {
  document.getElementById('step2').style.display = 'none'
  document.getElementById('step1').style.display = 'block'

  const timeInputs = document.querySelectorAll('input[name="time"]')
  timeInputs.forEach((input) => {
    input.disabled = false
    input.parentElement.style.color = 'black'
  })
}

document.getElementById('confirmBtn').addEventListener('click', async () => {
  const selectedTime = document.querySelector('input[name="time"]:checked')
  const selectedServices = document.querySelectorAll(
    '#box-card input[type="checkbox"]:checked'
  )
  const clientName = localStorage.getItem('clientName')
  const clientPhone = localStorage.getItem('clientPhone')
  const selectedDate = document.getElementById('date').value

  // Validar serviços
  if (selectedServices.length === 0) {
    alert('Por favor, selecione pelo menos um serviço.')
    return
  }

  // Validar horário
  if (!selectedTime) {
    alert('Por favor, selecione um horário.')
    return
  }

  // Validar cadastro do cliente
  if (!clientName) {
    alert('Por favor, faça o cadastro primeiro.')
    window.location.href = 'register.html'
    return
  }

  // Coletar serviços selecionados
  const services = []
  selectedServices.forEach((cb) =>
    services.push(cb.procedimento || cb.nextSibling.textContent.trim())
  )

  const booking = {
    horario: selectedTime.value,
    data: selectedDate,
    nome_funcionario: `${name}`,
    telefone_cliente: clientPhone,
    nome_cliente: clientName,
    valor: valorFinal,
    procedimento: services.join(', '),
  }

  await fetch('https://api-monfardini.onrender.com/horario_marcado', {
    method: 'POST',
    body: JSON.stringify(booking),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const address = 'Rua dos Guaranis, número 250'
  const summary = `Agendamento finalizado!\n\nCliente: ${clientName}\nTelefone: ${clientPhone}\nData: ${selectedDate}\nHorário: ${
    selectedTime.value
  }\nServiços: ${services.join(
    ', '
  )}\nValor: R$ ${valorFinal}\nEndereço: ${address}\nProfissional: ${name}`
  alert(summary)

  // Limpa campos
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((cb) => (cb.checked = false))
  document.getElementById('date').value = ''
  document
    .querySelectorAll('input[name="time"]')
    .forEach((r) => (r.checked = false))
  valorFinal = 0
  document.getElementById('valorFinal').innerText = ''
  document.getElementById('step2').style.display = 'none'
  document.getElementById('step1').style.display = 'block'

  // Redireciona para página de meus agendamentos
  window.location.href = 'meus-agendamentos.html'
  valorFinal = 0
  document.getElementById('valorFinal').innerText = ''
  document.getElementById('step2').style.display = 'none'
  document.getElementById('step1').style.display = 'block'
})