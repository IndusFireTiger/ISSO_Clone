const commentDiv = document.querySelector('#post_x')

const loadISSO_Clone = (whereToAppendForm, isReply) => {
  let commentHead = document.createElement('h4')
  let formDiv = document.createElement('div')
  let textarea = document.createElement('textarea')
  let inputName = document.createElement('input')
  let submitBtn = document.createElement('button')
  let commentContainer = document.createElement('form')

  commentHead.innerHTML = 'Leave a Comment:'
  formDiv.setAttribute('class', 'form-group')
  textarea.setAttribute('id', 'comment-input')
  textarea.setAttribute('class', 'form-control')
  inputName.setAttribute('id', 'comment-name')
  inputName.setAttribute('class', 'form-control')
  inputName.setAttribute('placeholder', 'name (optional)')
  submitBtn.setAttribute('class', 'btn btn-success')
  submitBtn.addEventListener('click', newCommentEvent)
  submitBtn.innerHTML = 'Submit'

  if (!isReply) {
    commentContainer.appendChild(commentHead)
  }
  formDiv.appendChild(textarea)
  formDiv.appendChild(inputName)
  commentContainer.appendChild(formDiv)
  commentContainer.appendChild(submitBtn)
  commentContainer.appendChild(document.createElement('br'))
  commentContainer.appendChild(document.createElement('br'))

  whereToAppendForm.appendChild(commentContainer)
  if (isReply) {
    commentContainer.setAttribute('class', 'reply hidden')
  }
}

const loadLogIn = () => {
  let userDiv = document.createElement('div')
  let userName = document.createElement('text')
  userName.textContent = 'Sindhu'

  userDiv.appendChild(userName)
  commentDiv.appendChild(userDiv)
}
function loadComments () {
  let url = 'http://localhost:5432/threadDetails'
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread: artId })
  }).then((res) => {
    return res.json()
  }).then((commentsJSON) => {
    let replies = []
    commentsJSON.forEach(item => {
      let isReply = addComment(item, false)
      if (isReply) {
        replies.push(isReply)
      }
    })
    console.log('replies w/o parent:',replies)
    replies.forEach(item=>{
      let isReply = addComment(item, false)
      if (isReply) {
        replies.push(isReply)
      }
    })
    console.log('replies w/o parent:',replies)
  }).catch((error) => {
    console.log('could not fetch : ' + url)
    console.error(error)
  })
}


let newCommentEvent = (e) => {
  e.preventDefault()
  console.log(e)
  let loc = e.target.parentElement.parentElement.id
  try {
    let commentJSON = {
      app_id: appId,
      thread_id: artId,
      parent_id: loc,
      content: e.path[1][0].value,
      by: e.path[1][1].value,
      user_id: null,
      time: Date()
    }
    console.log('new comment: ', commentJSON)
    let url = 'http://localhost:5432/saveComment'
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentJSON)
    }).then((res) => {
      return res.json()
    }).then((json) => {
      console.log('saved?', json)
    })
  } catch (err) {
    console.log(err)
  }
}

let addComment = (data, isReply) => {
  let parentDiv
  if (!isNaN(parseInt(data.parent_id))) {
    console.log('has parent:', parseInt(data.parent_id))
    console.log('child:', parseInt(data.comment_id))
    parentDiv = document.getElementById(data.parent_id)
    console.log(parentDiv)
    if (!parentDiv) {
      return data
    }
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
  let reply = document.createElement('small')
  let del = document.createElement('small')
  comDiv.setAttribute('class', 'col-sm-10 well')
  reply.addEventListener('click', replyComment)
  del.addEventListener('click', delComment)

  if (data !== null && data !== undefined) {
    name.textContent = data.by + '  '
    time.textContent = data.time
    cont.textContent = data.content
    reply.textContent = 'Reply ' // add padding
    del.textContent = ' Delete'
    comDiv.setAttribute('id', data.comment_id)
  }
  comment.setAttribute('class', '.container')
  comDiv.appendChild(name)
  name.appendChild(time)
  comDiv.appendChild(cont)
  comFooter.appendChild(reply)
  // comFooter.appendChild(del)
  comDiv.appendChild(comFooter)

  loadISSO_Clone(comDiv, true)

  if (parentDiv) {
    parentDiv.appendChild(comDiv)
  } else {
    comment.insertBefore(comDiv, comment.firstChild)
  }
}

const replyComment = (e) => {
  let replyComDiv = e.target.parentElement
  let display = replyComDiv.nextSibling.getAttribute('class')
  if (display === 'reply hidden') {
    replyComDiv.nextSibling.setAttribute('class', 'reply')
  } else if (display === 'reply') {
    replyComDiv.nextSibling.setAttribute('class', 'reply hidden')
  }
}

const delComment = (e) => {
  console.log(artId)
}

loadLogIn()
loadISSO_Clone(commentDiv)
loadComments()

soc = io.connect('http://localhost:5432')
soc.on('connect', () => {
  soc.emit('join room', { id: artId })
  console.log('client connected thru socket -room:' + artId)
})
soc.on('updateClients', data => {
  console.log('soc event - update comment: ', data)
  addComment(data)
})
