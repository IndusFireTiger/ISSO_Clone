const commentDiv = document.querySelector('#post_x')

let loadISSO_Clone = () => {
    let commentHead = document.createElement('h4')
    commentHead.innerHTML = 'Leave a Comment:'
    let formDiv = document.createElement('div')
    formDiv.setAttribute('class', 'form-group')
    let textarea = document.createElement('textarea')
    textarea.setAttribute('id', 'comment-input')
    textarea.setAttribute('class', 'form-control')
    let inputName = document.createElement('input')
    inputName.setAttribute('id', 'comment-name')
    inputName.setAttribute('class', 'form-control')
    inputName.setAttribute('placeholder', 'name (optional)')
    let submitBtn = document.createElement('button')
    submitBtn.setAttribute('class', 'btn btn-success')
    submitBtn.setAttribute('onclick', 'newCommentEvent()')
    submitBtn.innerHTML = 'Submit'

    commentDiv.appendChild(commentHead)
    formDiv.appendChild(textarea)
    formDiv.appendChild(inputName)
    commentDiv.appendChild(formDiv)
    commentDiv.appendChild(submitBtn)
}

loadISSO_Clone()


let newComment = document.querySelector("#comment-input"),
    commenter = document.querySelector("#comment-name")

let newCommentEvent = () => {
    console.log(newComment)
    console.log(commenter)
    soc.emit('newComment', { id: artId, content: newComment.value, by: commenter.value, time: Date() })
}
let addComment = (data) => {
    if (!document.getElementById("comment_x")) {
        let comment = document.createElement("div")
        comment.setAttribute("class", ".container")
        comment.setAttribute("id", "comment_x")
        commentDiv.appendChild(comment)
    }
    let comment = document.getElementById("comment_x")
    let name = document.createElement("h4")
    let time = document.createElement("small")
    let cont = document.createElement("p")
    let comDiv = document.createElement("div")
    comDiv.setAttribute("class", "col-sm-10 well")

    if (data !== null && data !== undefined) {
        name.textContent = data['by'] + "  "
        time.textContent = data['time']
        cont.textContent = data['content']
    }
    comment.setAttribute("class", ".container")
    comDiv.appendChild(name)
    name.appendChild(time)
    comDiv.appendChild(cont)
    comment.insertBefore(comDiv, comment.firstChild)
}
soc = io.connect('http://localhost:5432')
console.log(soc)

soc.on('connect', () => {
    console.log('client connected thru socket -room:' + artId)
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