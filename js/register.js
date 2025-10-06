document
  .getElementById('registerForm')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value
    const errorMessage = document.getElementById('error-message')

    errorMessage.style.display = 'none'
    errorMessage.textContent = ''

    if (!name || !email || !password || !confirmPassword) {
      errorMessage.textContent = 'Por favor, preencha todos os campos.'
      errorMessage.style.display = 'block'
      return
    }

    if (!email.includes('@')) {
      errorMessage.textContent = 'Por favor, insira um e-mail válido.'
      errorMessage.style.display = 'block'
      return
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = 'As senhas não coincidem.'
      errorMessage.style.display = 'block'
      return
    }

    // Envia para o banco de dados (API)
    fetch('https://api-monfardini.onrender.com/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: name,
        telefone: phone,
        email: email,
        senha: password,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao cadastrar usuário')
        // Salva localmente também
        localStorage.setItem('clientName', name)
        localStorage.setItem('clientPhone', phone)
        localStorage.setItem('clientEmail', email)
        localStorage.setItem('clientPassword', password)
        window.location.href = 'login.html'
      })
      .catch((err) => {
        errorMessage.textContent = 'Erro ao cadastrar usuário. Tente novamente.'
        errorMessage.style.display = 'block'
      })
  })
