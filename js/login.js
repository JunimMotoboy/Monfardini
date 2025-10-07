document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const role = document.querySelector('input[name="role"]:checked').value
    const errorMessage = document.getElementById('error-message')

    errorMessage.style.display = 'none'
    errorMessage.textContent = ''

    if (!email) {
      errorMessage.textContent = 'Por favor, preencha o campo de e-mail.'
      errorMessage.style.display = 'block'
      return
    }

    if (!email.includes('@')) {
      errorMessage.textContent = 'Por favor, insira um e-mail válido.'
      errorMessage.style.display = 'block'
      return
    }

    if (!password) {
      errorMessage.textContent = 'Por favor, preencha o campo de senha.'
      errorMessage.style.display = 'block'
      return
    }

    if (role === 'user') {
      fetch('https://api-monfardini.onrender.com/usuarios')
        .then((response) => response.json())
        .then((users) => {
          console.log(users)
          const user = users.find(
            (u) => u.email === email && u.senha === password
          )
          console.log(user)
          if (!user) {
            errorMessage.textContent =
              'E-mail ou senha incorretos ou usuário não cadastrado.'
            errorMessage.style.display = 'block'
            return
          }
          window.location.href = 'profissional.html'
        })
        .catch(() => {
          errorMessage.textContent =
            'Erro ao conectar com o servidor. Tente novamente mais tarde.'
          errorMessage.style.display = 'block'
        })
    } else if (role === 'admin') {
      // Busca funcionários e autentica por email/senha únicos
      fetch('https://api-monfardini.onrender.com/funcionarios')
        .then((response) => response.json())
        .then((funcs) => {
          const funcionario = funcs.find(
            (f) => f.email === email && f.senha === password
          )
          if (!funcionario) {
            errorMessage.textContent =
              'E-mail ou senha de funcionário incorretos.'
            errorMessage.style.display = 'block'
            return
          }
          // Salva id/email do funcionário logado para filtrar no admin
          localStorage.setItem('funcionarioId', funcionario.id)
          localStorage.setItem('funcionarioEmail', funcionario.email)
          window.location.href = 'admin.html'
        })
        .catch(() => {
          errorMessage.textContent =
            'Erro ao conectar com o servidor. Tente novamente mais tarde.'
          errorMessage.style.display = 'block'
        })
    }
  })
