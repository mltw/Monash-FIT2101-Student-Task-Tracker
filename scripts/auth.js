async function getUserGroup(uid){
  const userDoc= await db.collection('users').doc(uid).get();
  var userGroup= await userDoc.get('userGroup');
  if(userGroup=="student"){
    //redirect to student main page if user is student
     window.location.href = "student_page.html";
  }
  else if(userGroup=="marker"){
    //redirect to student main page if user is student
    window.location.href = "marker_page.html";
  }
  else{
    console.log("Incorrect user category, please delete the user as only students and markers can exist.");
  }
};

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    
    var uid=cred.user['uid']
    getUserGroup(uid);
    
  }).catch(err => {

    alert(err.message);
    console.log(err.message);
});

});
