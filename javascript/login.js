document.getElementById("loginBtn").onclick = function(){
 let email = document.getElementById("email").value.trim();
 let password = document.getElementById("password").value.trim()

    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...
    firebase.firestore().collection("users");
    window.location.href = "index.html"
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}



