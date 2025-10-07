// Admin Panel JavaScript

let currentBookings = []
let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()
let selectedCalendarDate = null

function logoutAdmin() {
  window.location.href = 'login.html'
}

// Tabs
function openTab(tabName, evt) {
  const tabs = document.querySelectorAll('.tab-content')
  tabs.forEach((tab) => tab.classList.remove('active'))
  document.getElementById(tabName).classList.add('active')

  const tabBtns = document.querySelectorAll('.tab-btn')
  tabBtns.forEach((btn) => btn.classList.remove('active'))
  evt.target.classList.add('active')
}

// Load and display bookings
function loadBookings() {
  fetch('https://api-monfardini.onrender.com/horario_marcado')
    .then((response) => response.json())
    .then((data) => {
      // Adaptar os dados recebidos da API para o formato esperado pelo restante do código
      currentBookings = data.map((booking, idx) => ({
        id: booking.id || idx,
        name: booking.nome_cliente || '',
        phone: booking.telefone_cliente || '',
        date: booking.data || '',
        time: booking.horario || '',
        services: booking.procedimento
          ? booking.procedimento.split(',').map((s) => s.trim())
          : [],
        value: booking.valor || 0,
      }))
      displayBookings()
      renderCalendar()
    })
    .catch((err) => {
      currentBookings = []
      displayBookings()
      renderCalendar()
      console.error('Erro ao buscar agendamentos da API:', err)
    })
}

function displayBookings() {
  const list = document.getElementById('bookingsList')
  list.innerHTML = ''

  currentBookings.forEach((booking) => {
    const item = document.createElement('div')
    item.className = 'booking-item'
    item.innerHTML = `
            <h3>${booking.name} - ${booking.phone}</h3>
            <p>Data: ${booking.date} | Horário: ${booking.time}</p>
            <p>Serviços: ${booking.services.join(', ')}</p>
            <p>Valor: R$ ${booking.value}</p>
            <button class="edit-btn" onclick="editBooking(${
              booking.id
            })">Editar</button>
            <button class="delete-btn" onclick="confirmDelete(${
              booking.id
            })">Remover</button>
        `
    list.appendChild(item)
  })
}

function refreshBookings() {
  loadBookings()
}

// Edit booking
function editBooking(id) {
  const booking = currentBookings.find((b) => b.id === id)
  if (booking) {
    document.getElementById('editId').value = booking.id
    document.getElementById('editName').value = booking.name
    document.getElementById('editPhone').value = booking.phone
    document.getElementById('editDate').value = booking.date
    document.getElementById('editTime').value = booking.time
    document.getElementById('editServices').value = booking.services.join(', ')
    document.getElementById('editValue').value = booking.value
    document.getElementById('editModal').style.display = 'block'
  }
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none'
}

document.getElementById('editForm').addEventListener('submit', function (e) {
  e.preventDefault()
  const id = parseInt(document.getElementById('editId').value)
  const index = currentBookings.findIndex((b) => b.id === id)
  if (index !== -1) {
    // Monta objeto para enviar ao servidor
    const updatedBooking = {
      id: id,
      nome_cliente: document.getElementById('editName').value,
      telefone_cliente: document.getElementById('editPhone').value,
      data: document.getElementById('editDate').value,
      horario: document.getElementById('editTime').value,
      procedimento: document.getElementById('editServices').value,
      valor: parseFloat(document.getElementById('editValue').value),
    }
    fetch(`https://api-monfardini.onrender.com/horario_marcado/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBooking),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao atualizar agendamento')
        return res.json()
      })
      .then(() => {
        loadBookings()
        closeModal()
      })
      .catch((err) => {
        alert('Erro ao atualizar agendamento!')
        console.error(err)
      })
  }
})

function deleteBooking() {
  const id = parseInt(document.getElementById('editId').value)
  fetch(`https://api-monfardini.onrender.com/horario_marcado/${id}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) throw new Error('Erro ao excluir agendamento')
      loadBookings()
      closeModal()
    })
    .catch((err) => {
      alert('Erro ao excluir agendamento!')
      console.error(err)
    })
}

function confirmDelete(id) {
  if (confirm('Tem certeza que deseja remover este agendamento?')) {
    fetch(`https://api-monfardini.onrender.com/horario_marcado/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao excluir agendamento')
        loadBookings()
      })
      .catch((err) => {
        alert('Erro ao excluir agendamento!')
        console.error(err)
      })
  }
}

// Calendar
function renderCalendar() {
  const calendar = document.getElementById('calendarView')
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  document.getElementById(
    'currentMonth'
  ).textContent = `${monthNames[currentMonth]} ${currentYear}`

  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  calendar.innerHTML = `
        <div class="calendar-grid">
            <div class="day">Dom</div>
            <div class="day">Seg</div>
            <div class="day">Ter</div>
            <div class="day">Qua</div>
            <div class="day">Qui</div>
            <div class="day">Sex</div>
            <div class="day">Sáb</div>
        </div>
    `

  const grid = document.createElement('div')
  grid.className = 'calendar-grid'

  let date = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    const dayDiv = document.createElement('div')
    dayDiv.className = 'day'

    if (date.getMonth() === currentMonth) {
      dayDiv.textContent = date.getDate()

      // Check if today
      const today = new Date()
      if (date.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today')
      }

      // Check for bookings
      const dateStr = date.toISOString().split('T')[0]
      const dayBookings = currentBookings.filter((b) => b.date === dateStr)
      if (dayBookings.length > 0) {
        dayDiv.classList.add('has-booking')
        dayDiv.innerHTML += `<br><small>${dayBookings.length} agendamento(s)</small>`
      }

      // Clique para selecionar o dia
      dayDiv.style.cursor = 'pointer'
      dayDiv.addEventListener('click', () => {
        selectedCalendarDate = dateStr
        showDayBookings(dateStr)
        // Destacar o dia selecionado
        document
          .querySelectorAll('.calendar-grid .day.selected')
          .forEach((d) => d.classList.remove('selected'))
        dayDiv.classList.add('selected')
      })
    } else {
      dayDiv.classList.add('other-month')
    }

    grid.appendChild(dayDiv)
    date.setDate(date.getDate() + 1)
  }

  calendar.appendChild(grid)

  // Exibir agendamentos do dia selecionado, se houver
  if (selectedCalendarDate) {
    showDayBookings(selectedCalendarDate)
  } else {
    // Por padrão, mostra o dia de hoje
    const todayStr = new Date().toISOString().split('T')[0]
    showDayBookings(todayStr)
  }
}

// Exibe os agendamentos do dia selecionado abaixo do calendário
function showDayBookings(dateStr) {
  let container = document.getElementById('dayBookingsList')
  if (!container) {
    container = document.createElement('div')
    container.id = 'dayBookingsList'
    const calendarTab = document.getElementById('calendar')
    calendarTab.appendChild(container)
  }
  container.innerHTML = ''
  const bookings = currentBookings.filter((b) => b.date === dateStr)
  const dateFormatted = dateStr.split('-').reverse().join('/')
  const title = document.createElement('h3')
  title.textContent = `Agendamentos do dia ${dateFormatted}`
  container.appendChild(title)
  if (bookings.length === 0) {
    container.innerHTML += '<p>Nenhum agendamento para este dia.</p>'
    return
  }
  bookings.forEach((booking) => {
    const item = document.createElement('div')
    item.className = 'booking-item'
    item.innerHTML = `
      <strong>${booking.time}</strong> - ${booking.name} (${booking.phone})<br>
      Serviços: ${booking.services.join(', ')}<br>
      Valor: R$ ${booking.value}
    `
    item.style.cursor = 'pointer'
    item.title = 'Clique para editar ou remover'
    item.addEventListener('click', () => {
      editBooking(booking.id)
    })
    container.appendChild(item)
  })
}

function prevMonth() {
  currentMonth--
  if (currentMonth < 0) {
    currentMonth = 11
    currentYear--
  }
  renderCalendar()
}

function nextMonth() {
  currentMonth++
  if (currentMonth > 11) {
    currentMonth = 0
    currentYear++
  }
  renderCalendar()
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  loadBookings()
  renderCalendar()
})