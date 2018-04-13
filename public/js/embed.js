const commentDiv = document.querySelector('#post_x')
let userLoggedIn = false
let userDetails = {}

const loadISSO_Clone = (whereToAppendForm, isReply) => {
  let formDiv = document.createElement('div')
  let textarea = document.createElement('textarea')
  let inputName = document.createElement('input')
  let submitBtn = document.createElement('button')
  let commentContainer = document.createElement('form')

  formDiv.setAttribute('class', 'form-group')
  // textarea.setAttribute('id', 'comment-input')
  textarea.setAttribute('class', 'form-control')
  // inputName.setAttribute('id', 'comment-name')
  inputName.setAttribute('class', 'form-control')
  inputName.setAttribute('placeholder', 'name (optional)')
  submitBtn.setAttribute('class', 'btn btn-success')
  submitBtn.addEventListener('click', newCommentEvent)
  submitBtn.innerHTML = 'Submit'

  formDiv.appendChild(textarea)
  formDiv.appendChild(inputName)
  commentContainer.appendChild(formDiv)
  commentContainer.appendChild(submitBtn)

  whereToAppendForm.appendChild(commentContainer)
  if (isReply) {
    commentContainer.setAttribute('class', 'reply hidden')
  } else {
    inputName.setAttribute('id', 'comment-by')
  }
}

const loadLogIn = () => {
  let userDiv = document.createElement('div')
  let loginDiv = document.createElement('div')
  let user = document.createElement('text')
  let userMenu = document.createElement('a')
  let userName = document.createElement('input')
  let pwd = document.createElement('input')
  let pwdConfirm = document.createElement('input')
  let signupLabel = document.createElement('label')
  let signupRadio = document.createElement('input')
  let loginBtn = document.createElement('input')
  user.setAttribute('id', 'userDisplayName')
  user.textContent = userDetails.name || 'None'
  userMenu.textContent = 'User Menu '
  userMenu.addEventListener('click', toggleUserMenu)
  signupRadio.addEventListener('click', toggleConfirmPwd)
  loginBtn.addEventListener('click', attemptLogin)
  loginBtn.textContent = 'Login/Signup '
  signupLabel.textContent = 'Signup'
  signupLabel.setAttribute('class', 'badge badge-default')
  signupRadio.setAttribute('id', 'signup')
  signupRadio.setAttribute('class', 'radio disabled')
  signupRadio.setAttribute('type', 'checkbox')
  loginBtn.setAttribute('class', 'btn btn-success')
  loginBtn.setAttribute('type', 'submit')
  userDiv.setAttribute('class', 'user-div')
  userMenu.setAttribute('class', 'user-menu')
  userName.setAttribute('placeholder', 'User Name')
  userName.setAttribute('id', 'username')
  pwd.setAttribute('placeholder', 'Password')
  pwd.setAttribute('type', 'password')
  pwd.setAttribute('id', 'pwd')
  pwdConfirm.setAttribute('type', 'password')
  pwdConfirm.setAttribute('id', 'confirmpwd')
  pwdConfirm.setAttribute('class', 'hidden')
  pwdConfirm.setAttribute('placeholder', 'Confirm Password')
  userName.setAttribute('width', '100%')
  pwd.setAttribute('width', '100%')
  pwdConfirm.setAttribute('width', '100%')
  userName.setAttribute('class', 'form-control')
  pwd.setAttribute('class', 'form-control')
  pwdConfirm.setAttribute('class', 'form-control hidden')
  loginDiv.setAttribute('id', 'user-login-form')
  loginDiv.setAttribute('class', 'login-form hidden')

  signupLabel.appendChild(signupRadio)
  loginDiv.appendChild(signupLabel)
  loginDiv.appendChild(userName)
  loginDiv.appendChild(pwd)
  loginDiv.appendChild(pwdConfirm)
  loginDiv.appendChild(loginBtn)
  userDiv.appendChild(user)
  userDiv.appendChild(document.createElement('br'))
  userDiv.appendChild(userMenu)
  userDiv.appendChild(loginDiv)
  commentDiv.appendChild(userDiv)
}

function loadComments () {
  console.log('fetching threadDetails')
  let url = 'http://localhost:5432/threadDetails'
  let fetchMode = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ thread: artId })
  }

  fetch(url, fetchMode).then((res) => { return res.json() }).then((commentsJSON) => {
    let replies = []
    commentsJSON.forEach(item => {
      let isReply = addComment(item, false)
      if (isReply) {
        replies.push(isReply)
      }
    })
    replies.forEach(item => {
      let isReply = addComment(item, false)
      if (isReply) {
        replies.push(isReply)
      }
    })
  }).catch((error) => {
    console.log('could not fetch : ' + url)
    console.error(error)
  })
}

let newCommentEvent = (e) => {
  e.preventDefault()
  let loc = e.target.parentElement.parentElement.id
  let commentJSON = {
    app_id: appId,
    thread_id: artId,
    parent_id: loc,
    content: e.path[1][0].value,
    by: e.path[1][1].value,
    user_id: null,
    time: Date()
  }
  let url = 'http://localhost:5432/saveComment'
  let fetchMode = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentJSON)
  }

  fetch(url, fetchMode).then((res) => { return res.json() }).then((json) => {
    console.log('saved?', json)
  }).catch((err) => {
    console.log(err)
  })
}

let addComment = (data, isReply) => {
  let parentDiv
  if (!isNaN(parseInt(data.parent_id))) {
    parentDiv = document.getElementById(data.parent_id)
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

const toggleUserMenu = (e) => {
  let loginForm = e.target.nextSibling
  let display = loginForm.getAttribute('class')
  if (display === 'login-form hidden') {
    loginForm.setAttribute('class', 'login-form')
  } else if (display === 'login-form') {
    loginForm.setAttribute('class', 'login-form hidden')
  }
}

const toggleConfirmPwd = (e) => {
  let confirmPwd = document.getElementById('confirmpwd')
  let checked = e.target.checked
  if (checked) {
    confirmPwd.setAttribute('class', 'form-control')
  } else {
    confirmPwd.setAttribute('class', 'hidden')
  }
}

const attemptLogin = (e) => {
  let mode = document.getElementById('signup').checked
  let username = document.getElementById('username')
  let pwd = document.getElementById('pwd')
  let confirmpwd = document.getElementById('confirmpwd')
  // console.log(mode ? 'signup' : 'login')
  let loginDetails = {
    signup: mode,
    username: username.value,
    pwd: pwd.value,
    confirmpwd: confirmpwd.value
  }

  let url = 'http://localhost:5432/login'
  let fetchMode = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginDetails)
  }

  fetch(url, fetchMode).then((res) => { return res.json() }).then((result) => {
    console.log(result)
    if (result.status === 'login successful') {
      userLoggedIn = true
      userDetails.name = loginDetails.username
      console.log('display:', loginDetails.username)
      let user = document.getElementById('userDisplayName')
      user.textContent = 'Hi, ' + loginDetails.username
      document.getElementById('user-login-form').setAttribute('class', 'login-form hidden')
      let commenter = document.getElementById('comment-by')
      console.log(commenter)
      commenter.setAttribute('placeholder', '')
      commenter.value = loginDetails.username
      commenter.disabled = true
    }
  })
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
