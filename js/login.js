document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

   
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    
    if (!email || !password) {
        errorMessage.textContent = 'Por favor, preencha todos os campos.';
        errorMessage.style.display = 'block';
        return;
    }

    if (!email.includes('@')) {
        errorMessage.textContent = 'Por favor, insira um e-mail válido.';
        errorMessage.style.display = 'block';
        return;
    }

    
    window.location.href = 'index.html';
});
