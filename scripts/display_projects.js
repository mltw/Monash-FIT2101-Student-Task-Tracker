async function createProjects(uid,user_email){
  const userDoc= await db.collection('users').doc(uid).get();
  var userGroup= await userDoc.get('userGroup');
  if(userGroup=="marker"){
      //only query the projects related to the current user
      db.collection("projects").where("createdBy", "==", user_email)
      .get()
      .then(function(querySnapshot) {
          let output = "";
          if(querySnapshot.size !== 0){
              querySnapshot.forEach(function(doc) {
                  output += '<button type="button" class="btn btn-light" onclick="markerSelectThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                  output += doc.data().projectName + '</p></button>';
                  output += '<span style="padding-left: 40px"></span>';
              });
          }else{
              output = '<div class="alert alert-warning" role="alert">';
              output += 'Currently, there are no projects</div>';
          }

          document.getElementById("projects-module").innerHTML = output;
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }
  else if(userGroup=="student"){
      //only query the projects related to the current user
      db.collection("projects").where('members', 'array-contains', user_email)
      .get()
      .then(function(querySnapshot) {
          let output = "";
          if(querySnapshot.size !== 0) {
              querySnapshot.forEach(function(doc) {
                  output += '<button type="button" class="btn btn-light" onclick="studentSelectThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                  output += doc.data().projectName + '</p></button>';
                  output += '<span style="padding-left: 40px"></span>';
              });
          }else{
              output = '<div class="alert alert-warning" role="alert">';
              output += 'Currently, there are no projects</div>';
          }

          document.getElementById("projects-module").innerHTML = output;
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
      document.getElementById("dropdownMenuLink").innerHTML = "Logged In As "+ user.displayName;
      document.getElementById("welcome").innerHTML = "Welcome, " + user.displayName + "!";

      if (user != null) {
        uid= user.uid;
        user_email = user.email;
        createProjects(uid,user_email);
      }
    }
    else{
      console.log('not logged in');
    }
  }
);

function studentSelectThisProject(docId, projectName){
    window.location.href = "student_project_page.html?projectId=" + docId + "&projectName=" + projectName;
}

function markerSelectThisProject(docId, projectName){
    window.location.href = "marker_project_page.html?projectId=" + docId + "&projectName=" + projectName;
}
