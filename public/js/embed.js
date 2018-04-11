const commentDiv = document.querySelector('#post_x')

const loadISSO_Clone = () => {
  let commentHead = document.createElement('h4')
  let formDiv = document.createElement('div')
  let textarea = document.createElement('textarea')
  let inputName = document.createElement('input')
  let submitBtn = document.createElement('button')

  commentHead.innerHTML = 'Leave a Comment:'
  formDiv.setAttribute('class', 'form-group')
  textarea.setAttribute('id', 'comment-input')
  textarea.setAttribute('class', 'form-control')
  inputName.setAttribute('id', 'comment-name')
  inputName.setAttribute('class', 'form-control')
  inputName.setAttribute('placeholder', 'name (optional)')
  submitBtn.setAttribute('class', 'btn btn-success')
  submitBtn.setAttribute('onclick', 'newCommentEvent()')
  submitBtn.innerHTML = 'Submit'

  commentDiv.appendChild(commentHead)
  formDiv.appendChild(textarea)
  formDiv.appendChild(inputName)
  commentDiv.appendChild(formDiv)
  commentDiv.appendChild(submitBtn)
  commentDiv.appendChild(document.createElement('br'))
  commentDiv.appendChild(document.createElement('br'))
}

function loadComments () {
  let url = 'http://localhost:5432/threadDetails'
  console.log('fetching commented for article: ', artId)
  fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'thread=' + artId,
    mode: 'no-cors'

  }).then(response => cache.put(request, response)
  ).then((commentsJSON) => {
    console.log('comments:', commentsJSON)
  }).catch((error) => {
    console.log("could not fetch : " + url)
    console.error(error)
  })
  console.log('fetched')
}

loadISSO_Clone()
loadComments()

let newComment = document.querySelector('#comment-input')
let commenter = document.querySelector('#comment-name')

let newCommentEvent = () => {
  soc.emit('newComment', { id: artId, content: newComment.value, by: commenter.value, time: Date() })
}
let addComment = (data) => {
  if (!document.getElementById('comment_x')) {
    let comment = document.createElement('div')
    comment.setAttribute('class', '.container')
    comment.setAttribute('id', 'comment_x')
    commentDiv.appendChild(comment)
  }
  let comment = document.getElementById('comment_x')
  let name = document.createElement('h4')
  let time = document.createElement('small')
  let cont = document.createElement('p')
  let comDiv = document.createElement('div')
  comDiv.setAttribute('class', 'col-sm-10 well')

  if (data !== null && data !== undefined) {
    name.textContent = data['by'] + '  '
    time.textContent = data['time']
    cont.textContent = data['content']
  }
  comment.setAttribute('class', '.container')
  comDiv.appendChild(name)
  name.appendChild(time)
  comDiv.appendChild(cont)
  comment.insertBefore(comDiv, comment.firstChild)
}

soc = io.connect('http://localhost:5432')
soc.on('connect', () => {
  soc.emit('join room', { id: artId })
  console.log('client connected thru socket -room:' + artId)
})
soc.on('updateClients', data => {
  console.log('soc event - update comment: ' + 'commentId ' + data.commentId + ' for artId:' + data.id)
  addComment(data)
})
