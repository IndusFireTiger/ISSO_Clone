let addComment = () => {
    let content = document.getElementById("comment-input")
    let block = document.getElementById("post_x")
    let comment = document.createElement("div")
    let p = document.createElement("p")

    p.textContent = content.value
    comment.setAttribute("class", ".container")
    comment.appendChild(p)
    block.appendChild(comment)
}