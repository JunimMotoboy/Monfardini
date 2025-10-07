async function carregarProfissionais() {
  const res = await fetch('https://api-monfardini.onrender.com/funcionarios')
  const data = await res.json()
  console.log(data)

  data.forEach(async (profissional) => {
    var div = document.createElement('div')
    let fotoUrl = '/img/perfil.png'
    // Busca imagem pelo id
    try {
      const resImg = await fetch(
        `https://api-monfardini.onrender.com/funcionarios/${profissional.id}/imagem`
      )
      const imgData = await resImg.json()
      if (imgData.img) fotoUrl = imgData.img
    } catch {}
    div.innerHTML = `
      <img src="${fotoUrl}" alt="Foto de ${profissional.name}" style="max-width:180px; border-radius:50%; box-shadow:0 2px 8px #aaa; cursor:pointer;" onclick="window.location.href= 'index.html?cargo=${profissional.cargo}&name=${profissional.name}'" />
      <h2>${profissional.name}</h2>
    `
    document.getElementById('img-box').appendChild(div)
  })
}

function goBackToLogin() {
  window.location.href = 'login.html'
}

carregarProfissionais()
