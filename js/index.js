let valorFinal = 0;
const durations = {
  banhoDeGel: 1,
  aplicacaoDeGel: 3,
  manutencao: 1.5,
  decoracao: 0,
};
const queryString = window.location.search;
const searchParams = new URLSearchParams(queryString);
const cargo = searchParams.get("cargo");
console.log(cargo);

function goBackToLogin() {
  window.location.href = "login.html";
}
const procedimentosDiv = document.getElementById("box-card");

async function carregarProcedimentos() {
  const res = await fetch(
    `https://api-monfardini.onrender.com/procedimentos/${cargo}`
  );
  const data = await res.json();
  data.forEach((procedimento) => {
    var div = document.createElement("div");
    div.innerHTML = ` 
      <div class="card">
        <label>
          <input type="checkbox" id="${procedimento.id}" value="${procedimento.valor}">
          ${procedimento.procedimento} - R$ ${procedimento.valor}
        </label>
      </div> 
    `;
    procedimentosDiv.appendChild(div);
  });
   procedimentosDiv.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const checkbox = e.target;
      const valor = Number(checkbox.value);

      if (checkbox.checked) {
        valorFinal += valor;
      } else {
        valorFinal -= valor;
      }

      document.getElementById("valorFinal").innerText = `R$ ${valorFinal.toFixed(2)}`;
    }
  });
  console.log(data);
}

carregarProcedimentos();

const horariosDiv = document.getElementById("timeOpt");

async function carregarHorarios() {
  const res = await fetch("https://api-monfardini.onrender.com/horarios");
  const data = await res.json();
  data.forEach((horario) => {
    var div = document.createElement("div");
    div.className = "card";
    div.innerHTML = ` 
        <label for="${horario.id}"
          ><input type="radio" name="time" id="${horario.id}" value="${horario.horario}" /> ${horario.horario}</label
        >
      `;
    horariosDiv.appendChild(div);
  });
}
carregarHorarios();

function goToStep2() {
  const selectedServices = document.querySelectorAll(
    '#box-card input[type="checkbox"]:checked'
  );
  const selectedDate = document.getElementById("date").value;

  if (selectedServices.length === 0) {
    alert(
      "Por favor, selecione pelo menos um serviço antes de escolher o horário."
    );
    return;
  }
  if (!selectedDate) {
    alert("Por favor, selecione uma data.");
    return;
  }

  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
}

function goBackToStep1() {
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").style.display = "block";

  const timeInputs = document.querySelectorAll('input[name="time"]');
  timeInputs.forEach((input) => {
    input.disabled = false;
    input.parentElement.style.color = "black";
  });
}

document.getElementById("confirmBtn").addEventListener("click", () => {
  const selectedTime = document.querySelector('input[name="time"]:checked');
  const selectedServices = document.querySelectorAll(
    '#box-card input[type="checkbox"]:checked'
  );
  const clientName = localStorage.getItem("clientName");
  const clientPhone = localStorage.getItem("clientPhone");
  const selectedDate = document.getElementById("date").value;

  // Validar serviços
  if (selectedServices.length === 0) {
    alert("Por favor, selecione pelo menos um serviço.");
    return;
  }

  // Validar horário
  if (!selectedTime) {
    alert("Por favor, selecione um horário.");
    return;
  }

  // Validar cadastro do cliente
  if (!clientName) {
    alert("Por favor, faça o cadastro primeiro.");
    window.location.href = "register.html";
    return;
  }

  // Coletar serviços selecionados
  const services = [];
  selectedServices.forEach((cb) => services.push(cb.value));

  const booking = {
    id: Date.now(),
    name: clientName,
    phone: clientPhone,
    date: selectedDate,
    time: selectedTime.value,
    services: services,
    value: valorFinal,
  };

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  const address = "Rua dos Guaranis, número 250";
  const professional = "Fernanda";
  const summary = `Agendamento finalizado!\n\nCliente: ${clientName}\nTelefone: ${clientPhone}\nData: ${selectedDate}\nHorário: ${
    selectedTime.value
  }\nServiços: ${services.join(
    ", "
  )}\nValor: R$ ${valorFinal}\nEndereço: ${address}\nProfissional: ${professional}`;
  alert(summary);

  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
  document.getElementById("date").value = "";
  document.querySelectorAll('input[name="time"]').forEach((r) => (r.checked = false));
  valorFinal = 0;
  document.getElementById("valorFinal").innerText = "";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step1").style.display = "block";
});
