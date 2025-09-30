async function carregarProfissionais() {
    const res = await fetch("https://api-monfardini.onrender.com/funcionarios")
    const data = await res.json()
    console.log(data)

    data.forEach(profissional => {
    var div = document.createElement("div")
    div.innerHTML = ` 
          <img src="/img/perfil.png" alt="Fernanda-png" onclick="window.location.href= 'index.html'" />
          <h2>${profissional.name}</h2>`
        
          document.getElementById('img-box').appendChild(div)
    })
}
        
carregarProfissionais()