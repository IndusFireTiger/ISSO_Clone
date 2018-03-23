const commentDiv = document.querySelector('#post_x')

window.onload = () => {
    let commentHead = document.createElement('h4')
    let formDiv = document.createElement('div')
    let textarea = document.createElement('textarea')
    let inputName = document.createElement('input')
    let submitBtn = document.createElement('button')

    commentHead.innerHTML = 'Leave a Comment:'
    formDiv.setAttribute('class','form-group')
    textarea.setAttribute('id', 'comment-input')
    textarea.setAttribute('class','form-control')
    inputName.setAttribute('id', 'comment-name')
    inputName.setAttribute('class','form-control')
    inputName.setAttribute('placeholder','name (optional)')
    submitBtn.setAttribute('class', 'btn btn-success')
    submitBtn.setAttribute('onclick', 'newCommentEvent()')
    submitBtn.innerHTML = 'Submit'

    commentDiv.appendChild(commentHead)
    formDiv.appendChild(textarea)
    formDiv.appendChild(inputName)
    commentDiv.appendChild(formDiv)
    commentDiv.appendChild(submitBtn)
}
