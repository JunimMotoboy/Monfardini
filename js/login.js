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
        const storedEmail = localStorage.getItem('clientEmail');
        const storedPassword = localStorage.getItem('clientPassword');
        if (!storedEmail || !storedPassword) {
            errorMessage.textContent = 'Usuário não cadastrado. Por favor, cadastre-se primeiro.';
            errorMessage.style.display = 'block';
            return;
        }
        if (email !== storedEmail || password !== storedPassword) {
            errorMessage.textContent = 'E-mail ou senha incorretos.';
            errorMessage.style.display = 'block';
            return;
        }
        window.location.href = 'index.html';
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
