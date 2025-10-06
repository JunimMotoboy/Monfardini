document.addEventListener('DOMContentLoaded', async function () {
  const list = document.getElementById('meusAgendamentosList')
  list.innerHTML = '<p>Carregando...</p>'

  // Busca nome e telefone do localStorage
  const nome = localStorage.getItem('clientName')
  const telefone = localStorage.getItem('clientPhone')

  if (!nome && !telefone) {
    list.innerHTML =
      '<p>Faça login ou cadastre-se para ver seus agendamentos.</p>'
    return
  }

  try {
    const res = await fetch(
      'https://api-monfardini.onrender.com/horario_marcado'
    )
    const data = await res.json()
    // Filtra agendamentos do usuário
    const meus = data.filter(
      (a) =>
        (a.nome_cliente &&
          a.nome_cliente.trim().toLowerCase() === nome?.trim().toLowerCase()) ||
        (a.telefone_cliente && a.telefone_cliente === telefone)
    )
    if (meus.length === 0) {
      list.innerHTML = '<p>Nenhum agendamento encontrado.</p>'
      return
    }
    list.innerHTML = ''
    meus.forEach((ag) => {
      const div = document.createElement('div')
      div.className = 'booking-item'
      div.innerHTML = `<strong>Data:</strong> ${ag.data} <br>
        <strong>Horário:</strong> ${ag.horario} <br>
        <strong>Profissional:</strong> ${ag.nome_funcionario || ''} <br>
        <strong>Serviços:</strong> ${ag.procedimento} <br>
        <strong>Valor:</strong> R$ ${ag.valor}<br>
        <button class='btn1' onclick='editarAgendamento(${
          ag.id
        })'>Editar</button>
        <button class='btn1' onclick='excluirAgendamento(${
          ag.id
        })'>Excluir</button>`
      list.appendChild(div)
    })

    // Funções globais para editar/excluir
    window.editarAgendamento = function (id) {
      const ag = meus.find((a) => a.id === id)
      if (!ag) return alert('Agendamento não encontrado!')
      // Preenche um prompt simples para edição
      const novoHorario = prompt('Novo horário:', ag.horario)
      if (!novoHorario) return
      fetch(`https://api-monfardini.onrender.com/horario_marcado/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ag, horario: novoHorario }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao editar')
          location.reload()
        })
        .catch(() => alert('Erro ao editar agendamento!'))
    }
    window.excluirAgendamento = function (id) {
      if (!confirm('Tem certeza que deseja excluir este agendamento?')) return
      fetch(`https://api-monfardini.onrender.com/horario_marcado/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao excluir')
          location.reload()
        })
        .catch(() => alert('Erro ao excluir agendamento!'))
    }
  } catch (e) {
    list.innerHTML = '<p>Erro ao buscar agendamentos.</p>'
  }
})
