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

function loadComments() {
  let url = 'http://localhost:5432/threadDetails'
  console.log('fetching commented for article: ', artId)
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({thread: artId})
    // mode: 'no-cors'
  }).then((res) => {
    console.log('in res block:', res)
    return res.json()
  }).then((commentsJSON) => {
    console.log('comments:', commentsJSON)
    let replies = []
    commentsJSON.forEach(item => {
      let isReply = addComment(item, false)
      if (isReply) {
        replies.push(isReply)
      }
    })
    replies.forEach(item => {
      addComment(item, true)
    })
  }).catch((error) => {
    console.log('could not fetch : ' + url)
    console.error(error)
  })
  console.log('fetched')
}

loadISSO_Clone()
loadComments()

let newComment = document.querySelector('#comment-input')
let commenter = document.querySelector('#comment-name')

let newCommentEvent = () => {
  let formData = new FormData()
  formData.append('app_id', 'xyzBlog')
  console.log('form data:', formData)
  let commentJSON = {
    app_id: 'xyzBlog',
    thread_id: artId,
    id: artId,
    parent_id: null,
    content: newComment.value,
    msg: newComment.value,
    by: commenter.value,
    user_id: null,
    time: Date()
  }
  let url = 'http://localhost:5432/saveComment'
  console.log('saving comment ', commentJSON)
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: JSON.stringify(commentJSON)
  }).then((res) => {
    console.log('in res block:', res)
    return res.json()
  })
  // soc.emit('newComment', commentJSON)
}
let addComment = (data, isReply) => {
  console.log('adding:', data.by, isReply)
  if (!isReply && data.parent_id) {
    console.log('has parent')
    return data
  }
  let parent
  if (isReply) {
    console.log('parent:',data.parent_id)
    parent = document.getElementById(data.parent_id)
  }
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
  let comFooter = document.createElement('footer')
  let reply = document.createElement('span')
  comDiv.setAttribute('class', 'col-sm-10 well')

  if (data !== null && data !== undefined) {
    name.textContent = data.by + '  '
    time.textContent = data.time
    cont.textContent = data.content
    reply.textContent = 'Reply'
    comDiv.setAttribute('id', data.comment_id)
  }
  comment.setAttribute('class', '.container')
  comDiv.appendChild(name)
  name.appendChild(time)
  comDiv.appendChild(cont)
  comFooter.appendChild(reply)
  comDiv.appendChild(comFooter)
  if (!isReply) {
    comment.insertBefore(comDiv, comment.firstChild)
  } 
  if(isReply) {
    parent.appendChild(comDiv)
  }
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
