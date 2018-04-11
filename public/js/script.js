let scriptIo = document.createElement('script')
scriptIo.src = 'http://localhost:5432/socket.io/socket.io.js'
scriptIo.onload = function () {
  let scriptEmbed = document.createElement('script')
  scriptEmbed.src = 'http://localhost:5432/js/embed.js'
  document.body.appendChild(scriptEmbed)
}
document.body.appendChild(scriptIo)
