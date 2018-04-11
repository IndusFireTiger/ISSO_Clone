let soc = io.connect('http://localhost:5432')
console.log(soc)

soc.on('connect', () => {
  console.log('client connected thru socket - room:' + artId)
  soc.emit('join room', { id: artId })
})
soc.on('news', data => {
  console.log('client recieved news')
  console.log(data)
  soc.emit('clientreply', { clientSays: 'hey Server' })
})
soc.on('updateClients', data => {
  console.log('update comment from soc:' + data)
  console.log('artId:' + data.id)
  console.log('commentId:' + data.commentId)
  addComment(data)
})
