document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    if (!email) {
        errorMessage.textContent = 'Por favor, preencha o campo de e-mail.';
        errorMessage.style.display = 'block';
        return;
    }

    if (!email.includes('@')) {
        errorMessage.textContent = 'Por favor, insira um e-mail válido.';
        errorMessage.style.display = 'block';
        return;
    }

    if (!password) {
        errorMessage.textContent = 'Por favor, preencha o campo de senha.';
        errorMessage.style.display = 'block';
        return;
    }

    if (role === 'user') {
        fetch('https://api-monfardini.onrender.com/usuarios')
            .then(response => response.json())
            .then(users => {
                console.log(users);
                const user = users.find(u => u.email === email && u.senha === password);
                console.log(user);
                if (!user) {
                    errorMessage.textContent = 'E-mail ou senha incorretos ou usuário não cadastrado.';
                    errorMessage.style.display = 'block';
                    return;
                }
                window.location.href = 'profissional.html';
            })
            .catch(() => {
                errorMessage.textContent = 'Erro ao conectar com o servidor. Tente novamente mais tarde.';
                errorMessage.style.display = 'block';
            });
    } else if (role === 'admin') {
        const adminEmail = 'admin@admin.com';
        const adminPassword = 'admin123';
        if (email !== adminEmail || password !== adminPassword) {
            errorMessage.textContent = 'Credenciais de administrador incorretas.';
            errorMessage.style.display = 'block';
            return;
        }
        window.location.href = 'admin.html';
    }
});