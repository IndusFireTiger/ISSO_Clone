const btnAddNewComment = document.querySelector("#btnAddComment"),
    artListDiv = document.querySelector("#artList"),
    articleDiv = document.querySelector("#article"),
    newComment = document.querySelector("#comment-input"),
    commenter = document.querySelector("#comment-name"),

    docId = window.location.pathname.split('/')
let artId


let populateArticles = (articles) => {
    for (let art of Object.entries(articles)) {
        console.log("art:")
        console.log(art)
        artId = art[1][0].postId
        console.log('artId:' + artId)
        preloadArticles(art[1])
        populateComments(art[1][0].comments)
    }
}
let populateComments = (comments) => {
    for (let com of Object.entries(comments)) {
        preloadComments(com[1])
    }
}
let newCommentEvent = () => {
    soc.emit('newComment', { id: artId, content: newComment.value, by: commenter.value, time: Date() })
}
let addArticle = (data) => {

}
let addComment = (data) => {
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
let preloadArticles = (data) => {
    console.log("helloooo:")
    console.log(data[0])
    let newArtDiv = document.createElement('div')
    let title = document.createElement('h3')
    let artPara = document.createElement('p')
    title.textContent = data[0].title
    artPara.textContent = data[0].content
    newArtDiv.appendChild(title)
    newArtDiv.appendChild(artPara)
    articleDiv.appendChild(newArtDiv)
}
let preloadComments = (data) => {

    let block = document.getElementById("post_x")
    if (!document.getElementById("comment_x")) {
        let comment = document.createElement("div")
        comment.setAttribute("class", ".container")
        comment.setAttribute("id", "comment_x")
        block.appendChild(comment)
    }
    addComment(data)
}

let fetchData = dataNeeded => {
    let fetchedData = fetch(dataNeeded)
        .then(function (response) {
            return response.json()
        })
        .then(function (myJSON) {
            populateArticles(myJSON)
            return myJSON
        })
        .catch(function (error) {
            console.log("could not fetch : " + dataNeeded)
            console.error(error)
        })
    return fetchedData
}

let data = fetchData('/public/articles.json'),
    soc = io.connect('http://localhost:5432')
console.log(soc)
console.log(docId)

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