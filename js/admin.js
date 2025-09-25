// Admin Panel JavaScript

const ADMIN_PASSWORD = 'admin123'; // Simple password for demo

let currentBookings = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Login
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadBookings();
        renderCalendar();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function logoutAdmin() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminLogin').style.display = 'flex';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// Tabs
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Load and display bookings
function loadBookings() {
    currentBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    displayBookings();
}

function displayBookings() {
    const list = document.getElementById('bookingsList');
    list.innerHTML = '';

    currentBookings.forEach(booking => {
        const item = document.createElement('div');
        item.className = 'booking-item';
        item.innerHTML = `
            <h3>${booking.name} - ${booking.phone}</h3>
            <p>Data: ${booking.date} | Horário: ${booking.time}</p>
            <p>Serviços: ${booking.services.join(', ')}</p>
            <p>Valor: R$ ${booking.value}</p>
            <button class="edit-btn" onclick="editBooking(${booking.id})">Editar</button>
            <button class="delete-btn" onclick="confirmDelete(${booking.id})">Remover</button>
        `;
        list.appendChild(item);
    });
}

function refreshBookings() {
    loadBookings();
}

// Edit booking
function editBooking(id) {
    const booking = currentBookings.find(b => b.id === id);
    if (booking) {
        document.getElementById('editId').value = booking.id;
        document.getElementById('editName').value = booking.name;
        document.getElementById('editPhone').value = booking.phone;
        document.getElementById('editDate').value = booking.date;
        document.getElementById('editTime').value = booking.time;
        document.getElementById('editServices').value = booking.services.join(', ');
        document.getElementById('editValue').value = booking.value;
        document.getElementById('editModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    const index = currentBookings.findIndex(b => b.id === id);
    if (index !== -1) {
        currentBookings[index] = {
            id: id,
            name: document.getElementById('editName').value,
            phone: document.getElementById('editPhone').value,
            date: document.getElementById('editDate').value,
            time: document.getElementById('editTime').value,
            services: document.getElementById('editServices').value.split(',').map(s => s.trim()),
            value: parseFloat(document.getElementById('editValue').value)
        };
        localStorage.setItem('bookings', JSON.stringify(currentBookings));
        displayBookings();
        renderCalendar();
        closeModal();
    }
});

function deleteBooking() {
    const id = parseInt(document.getElementById('editId').value);
    currentBookings = currentBookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(currentBookings));
    displayBookings();
    renderCalendar();
    closeModal();
}

function confirmDelete(id) {
    if (confirm('Tem certeza que deseja remover este agendamento?')) {
        currentBookings = currentBookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(currentBookings));
        displayBookings();
        renderCalendar();
    }
}

// Calendar
function renderCalendar() {
    const calendar = document.getElementById('calendarView');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

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
    `;

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    let date = new Date(startDate);
    for (let i = 0; i < 42; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        if (date.getMonth() === currentMonth) {
            dayDiv.textContent = date.getDate();

            // Check if today
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayDiv.classList.add('today');
            }

            // Check for bookings
            const dateStr = date.toISOString().split('T')[0];
            const dayBookings = currentBookings.filter(b => b.date === dateStr);
            if (dayBookings.length > 0) {
                dayDiv.classList.add('has-booking');
                dayDiv.innerHTML += `<br><small>${dayBookings.length} agendamento(s)</small>`;
            }
        }

        grid.appendChild(dayDiv);
        date.setDate(date.getDate() + 1);
    }

    calendar.appendChild(grid);
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Auto-login for demo (remove in production)
    // loginAdmin();
});
