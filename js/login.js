document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
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

    
    window.location.href = 'admin.html';
});
