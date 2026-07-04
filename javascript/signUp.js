document.getElementById("signBtn").onclick = function(){
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
    console.log(user)
    firebase.firestore().collection("users").doc(user.uid).set({
        name,
        email,
        userId: user.uid,
        createdOn: Date.now()
    }).then(()=>{
        window.location.href = "login.html"
    })
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.error(errorMessage)
  });
}











