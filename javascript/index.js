
let closeModalBtn = document.getElementById("closeModal");
let msg = document.getElementById("msg")

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    var uid = user.uid;
    // ...
    const quill = new Quill("#notesArea", {
    theme: "snow",
    placeholder: "Write your note..."
      });
    
    let modalOverlay = document.getElementById("modalOverlay");
    document.getElementById("openModal").onclick = function(){
      modalOverlay.style.display = "flex"
    }
    
    document.getElementById("closeModal").onclick = function(){
      modalOverlay.style.display = "none"
    }

    modalOverlay.onclick = function(event){
      if(event.target === modalOverlay){
        modalOverlay.style.display = "none"
      }
    }
    
    firebase.firestore().collection("users").doc(uid).get().then((usersDoc)=>{
        let userData = usersDoc.data();
        document.getElementById("userProfile").innerText = `Hello ${userData.name}`;

        document.getElementById("saveBtn").onclick = function(){
            let note = quill.root.innerHTML;
            let title = document.getElementById("title").value.trim();

            if(!title)return;
            if(!note)return;
            firebase.firestore().collection("notes").doc().set({
                title,
                note: note,
                createdBy: userData.name,
                userId: uid,
                pinned: false,
                createdOn: Date.now()
            }).then(()=>{
                closeModalBtn.click()
                let successMsg = document.createElement("p");
                successMsg.classList.add("message")
                successMsg.textContent = "Note added!"
                msg.append(successMsg)

                setTimeout(()=>{
                  successMsg.remove()
                },2000)
                document.getElementById("title").value = "";
                quill.setContents([]);
            
            }).catch((error)=>{
              console.error(error)
            })}
    })
    firebase.firestore().collection("notes").orderBy("pinned").onSnapshot((notesQuery)=>{
      document.getElementById("notes").innerHTML = "";
        notesQuery.forEach(note => {
            let notes = note.data();
            let notesId = note.id;
            let notesHtml = generateNoteHtml(notes,notesId);
            document.getElementById("notes").insertAdjacentHTML("afterbegin",notesHtml)
        });
    })

  
    function generateNoteHtml(notes,notesId){
        let date = new Date(notes.createdOn)
        return `<div onclick="navigate(\'${notesId}\')" class="card">
                        <h2>${notes.title}</h2>
                        <small>Date added ${date.toLocaleDateString()}</small>     
                </div>
                  <button id="toggleBtn" onclick="togglePin('${notesId}', ${notes.pinned})">
                ${notes.pinned ? "📌 Unpin note" : "📍 Pin note"}
                <button id="deleteBtn" onclick="deletePost('${notesId}')">Delete</button>
            </button>`
    }

  

    let searchBox = document.getElementById("searchBox");
    searchBox.addEventListener("input",()=>{
      let search = searchBox.value.trim();
      firebase.firestore().collection("notes").where("title",">=", search)
      .where("title","<=",search + "\uf8ff").get().then((searchQuery)=>{
        searchQuery.forEach((snap)=>{
          let notes = snap.data();
          let notesId = snap.id
           let searchHtml = generateQuery(notes,notesId)
          let notesSearched = document.getElementById("notes").insertAdjacentHTML("afterbegin",searchHtml)
        })
      
          function generateQuery(notes,notesId){
            document.getElementById("notes").innerHTML = "";
            return `<div onclick="navigate(\'${notesId}\')" class="card">
                        <h2>${notes.title}</h2>
                      
                </div>`
          }})
    })

    window.navigate = function(notesId){
        window.location.href = `notes.html?=${notesId}`;  
    }
  } else {
    // User is signed out
    // ...
    window.location.href = "login.html"
  }
});


 function togglePin(noteId, pinned){
    firebase.firestore()
        .collection("notes")
        .doc(noteId)
        .update({
            pinned: !pinned
        })
        .catch((error)=>{
          console.error(error)
        });

}

function deletePost(notesId){
    firebase.firestore().collection("notes").doc(notesId).delete().then(()=>{
      let errorMsg = document.createElement("p");
      errorMsg.classList.add("errorMessage")
      errorMsg.textContent = "Note deleted!"
      msg.append(errorMsg)
      setTimeout(()=>{
        errorMsg.remove()
      },2000)
      
    }).catch((error)=>{
      console.error(error)
    })
  }

document.getElementById("logoutBtn").onclick = function(){
    firebase.auth().signOut().then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
  console.error(error)
});
}


