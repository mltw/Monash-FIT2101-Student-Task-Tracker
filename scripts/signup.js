const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const name = signupForm['name'].value;
    const email = signupForm['email'].value;
    const id = signupForm['id'].value;
    const roleList = document.getElementById("mylist");
    const role = roleList.options[roleList.selectedIndex].value;
    const password = signupForm['psw'].value;
    const cfmPassword = signupForm['cfm-psw'].value;

    if(password !== cfmPassword){
        alert("Password is not the same");
    }else{
        // sign up the user & add firestore data
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            cred.user.updateProfile({
                displayName: name
            })
            console.log(cred);
            return db.collection('users').doc(cred.user.uid).set({
                userGroup: role,
                id: id
            })
        }).then(() => {
            signupForm.reset();
            alert("Successfully Registered User");
            window.location.href = "index.html";
        }).catch(err => {
            alert(err.message);
            console.log(err.message);
        });
    }

});