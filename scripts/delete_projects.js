
async function deleteProjects(uid,user_email){
  const userDoc= await db.collection('users').doc(uid).get();
  var userGroup= await userDoc.get('userGroup');
  if(userGroup=="marker"){
      db.collection("projects").where("createdBy", "==", user_email)
      .get()
      .then(function(querySnapshot) {
          let output = "";
          if(querySnapshot.size !== 0){
              querySnapshot.forEach(function(doc) {
                  output += '<button type="button" class="btn btn-light" onclick="deleteThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                  output += doc.data().projectName + '</p></button>';
                  output += '<span style="padding-left: 40px"></span>';
              });
          }else{
              output = '<div class="alert alert-warning" role="alert">';
              output += 'Currently, there are no projects</div>';
          }

          document.getElementById("projects_to_delete").innerHTML = output;
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }
}


var uid;
var user_email;
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log('logged in');
      var user = firebase.auth().currentUser;
      document.getElementById("dropdownMenuLink").innerHTML = "Logged In As "+ user.displayName
      if (user != null) {
        uid= user.uid;
        user_email = user.email;
        deleteProjects(uid,user_email);
      }
    }
    else{
      console.log('not logged in');
    }
  }
);


function deleteThisProject(docId, projectName) {
     db.collection("projects").doc(docId).delete().then(function() {
          alert("Project successfully deleted.");
          refreshPage();
     }).catch(function(error) {
          alert("Error removing project: ", error);
     })
};

function refreshPage(){
    location.reload();
}
