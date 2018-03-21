const btnAddNewComment = document.querySelector("#btnAddComment")
const newComment = document.querySelector("#comment-input")
const commenter = document.querySelector("#comment-name")

let populateComments = (comments) => {
    for (let com of Object.entries(comments)) {
        // console.log(com)
        preloadComments(com[1])
    }
    // console.log(Object.entries(comments))
}

let addComment = (data) => {
    let comment = document.getElementById("comment_x")
    let name = document.createElement("h4")
    let time = document.createElement("small")
    let cont = document.createElement("p")
    let comDiv = document.createElement("div")
    comDiv.setAttribute("class", "col-sm-10 well")

    console.log("data to append " + data)
    if (data !== null && data !== undefined) {
        name.textContent = data['by'] + "  "
        time.textContent = data['time']
        cont.textContent = data['content']
        console.log(data['by'])
    }
    else {
        cont.textContent = newComment.value
        name.textContent = commenter.value + "  "
        let date = Date()
        time.textContent = date
    }
    // comment.setAttribute("class", ".container")
    comDiv.appendChild(name)
    name.appendChild(time)
    comDiv.appendChild(cont)
    comment.insertBefore(comDiv, comment.firstChild)
}

let preloadComments = (data) => {
    console.log('preloading:' + data['by'])
    console.log('preloading:' + data['content'])

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
            console.log(response)
            return response.json()
        })
        .then(function (myJSON) {
            console.log(myJSON)
            populateComments(myJSON)
            return myJSON
        })
        .catch(function (error) {
            console.log("could not fetch : " + dataNeeded)
            console.error(error)
        })
    return fetchedData
}

// fetch ('/sindhu').then(response => response.json()).then(data => data).then(xyz => console.log(xyz))


let data = fetchData('/public/data/sample_comments.json')

// btnAddNewComment.onsubmit = function (){
//     console.log(newComment.value)
//     fetch('/addNewComment', {
//         'method': 'post',
//         'body': '{post: '+newComment.value+'}'
//       })
// }