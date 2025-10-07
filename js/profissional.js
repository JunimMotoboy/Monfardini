async function carregarProfissionais() {
    const res = await fetch("https://api-monfardini.onrender.com/funcionarios")
    const data = await res.json()
    console.log(data)

    data.forEach(profissional => {
    var div = document.createElement("div")
    div.innerHTML = ` 
          <img src="${profissional.img}" alt="Foto de ${profissional.name}" onclick="window.location.href= 'index.html?cargo=${profissional.cargo}&name=${profissional.name}'" />
          <h2>${profissional.name}</h2>`
        
          document.getElementById('img-box').appendChild(div)
    })
}
function goBackToLogin() {
  
  window.location.href = 'login.html';
}
        
carregarProfissionais()