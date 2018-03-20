let populateComments = (comments) => {
    for(let com of Object.entries(comments)){
        // console.log(com)
        preloadComments(com[1])
    }
    // console.log(Object.entries(comments))
}

let addComment = (data) => {
    let content = document.getElementById("comment-input")
    let block = document.getElementById("post_x")
    let comment = document.createElement("div")
    let p = document.createElement("p")

    if(data)
        p.textContent = data
    else
        p.textContent = content.value
    comment.setAttribute("class", ".container")
    comment.appendChild(p)
    block.appendChild(comment)
}

let preloadComments = (data) => {
    console.log('preloading:'+data['by'])
    console.log('preloading:'+data['content'])
    addComment(data['content'])
}

let fetchData = dataNeeded => {
    let fetchedData = fetch(dataNeeded)
        .then(function (response) {
            return response.json()  
        })
        .then(function (myJSON) {
            return myJSON
        })
        .then(function (xyz){
            console.log(xyz)
            populateComments(xyz)
            return xyz
        })
        .catch(function (error) {
            console.log("could not fetch : " + dataNeeded)
            console.error(error)
        })
    return fetchedData
}

let data = fetchData('/public/data/sample_comments.json')



