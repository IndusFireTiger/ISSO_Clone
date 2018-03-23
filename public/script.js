let script_io = document.createElement('script')
script_io.src = 'http://localhost:5432/socket.io/socket.io.js'
script_io.onload = function () {
    let script_embed = document.createElement('script')
    script_embed.src = 'http://localhost:5432/public/embed.js'
    document.body.appendChild(script_embed)
}
document.body.appendChild(script_io)
