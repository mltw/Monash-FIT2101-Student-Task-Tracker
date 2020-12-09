var uid;
var user_email;
firebase.auth().onAuthStateChanged(firebaseUser => {

    if(firebaseUser){
      var user = firebase.auth().currentUser;
      if (user != null) {
        uid= user.uid;
        user_email = user.email;
      }
      db.collection("tasks").where('assignedTo', 'array-contains', user_email)
      .get()
      .then(async function(querySnapshot) {
          let output = "";
          if(querySnapshot.size !== 0) {
              querySnapshot.forEach(await async function(doc) {
                 
                  var task_checklist_id= doc.id;
                  var project_checklist_id = doc.data().project

                  await db.collection("projects").doc(doc.data().project).
                  get().
                  then(async function(doc){
                    console.log(doc.data().projectName.toString());

                  output +='<div class = "card-header" style = "background-colour: yellow; cursor: pointer;" onclick="studentSelectThisTaskFromChecklist(\'' + task_checklist_id + '\',\'' + project_checklist_id + '\',\'' + doc.data().projectName +'\')"><h5>' + doc.data().projectName.toString() +'</h5>';

                  }).catch(function(error) {
                            console.log("Error getting documents: ", error);
                        });
                  output+= '<p><b>Task: ' + doc.data().title + '</b></p>';
                  output+= '<p>Due: ' + doc.data().dueDate.toDate() + '</p></div><br>';

                  document.getElementById("tasks-checklist").innerHTML = output;

              }); 

          }else{
              output += '<div class="alert alert-warning" role="alert">';
              output += 'Currently, there are no tasks due</div>';
              document.getElementById("tasks-checklist").innerHTML = output;

          }

          // document.getElementById("tasks-checklist").innerHTML = output;

      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });


      }
    }
  );

function studentSelectThisTaskFromChecklist(taskId,projectId,projectName) {
    window.location.href = "student_task_page.html?projectId=" + projectId + "&taskId=" + taskId + "&projectName=" + projectName;

}