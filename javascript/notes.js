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
    let selectedNote = decodeURIComponent(window.location.search)
    let selectedNoteId = selectedNote.substring(2)
    
      firebase.firestore().collection("notes").doc(selectedNoteId).get().then((doc) => {
          let note = doc.data();
          let noteId = doc.id
          document.getElementById("title").value = note.title;
          quill.root.innerHTML = note.note;
 
        });

        document.getElementById("saveBtn").onclick =  function(){
          firebase.firestore().collection("notes").doc(selectedNoteId).update({
            title: document.getElementById("title").value,
            note: quill.root.innerHTML
          }).then(()=>{
            let successMsg = document.createElement("p");
                successMsg.classList.add("message")
                successMsg.textContent = "Note edited!"
                msg.append(successMsg)
                setTimeout(()=>{
                  successMsg.remove()
                   window.location.href = "index.html"
                },2000)
               
          })}   

          document.getElementById("deleteBtn").onclick = function(){
            console.log(selectedNoteId)
            firebase.firestore().collection("notes").doc(selectedNoteId).delete().then(()=>{
              let successMsg = document.createElement("p");
                successMsg.classList.add("errorMessage")
                successMsg.textContent = "Note delete!"
                msg.append(successMsg)
                setTimeout(()=>{
                  successMsg.remove()
                   window.location.href = "index.html"
                },2000)
            })
          }
  } else {
    // User is signed out
    // ...
  }
});

function deleteNote(selectedNoteId){
  firebase.firestore().collection("notes").doc(selectedNoteId).delete().then(()=>{
    alert("Note Deleted!")
    window.location.href = "index.html"
  })
}

