var stud_email
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      var user = firebase.auth().currentUser;
      if (user != null) {
        stud_email = user.email;
      }
    }
  }
);

let projectId, projectName, taskId
function fetchSingleTask(){
    let urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get('projectId');
    projectName = urlParams.get('projectName');
    taskId = urlParams.get('taskId');
    document.getElementById("projectName").innerText = projectName;
    db.collection("tasks").doc(taskId)
        .get()
        .then(async function(doc) {
            let output = "";
            if (doc.exists) {
                output += '<h4>Task Details</h4><div class="card-header">';
                output += '<p>Task: ' + doc.data().title + '</p>';
                output += '<p>Task Created On: ' + formatDateTime(doc.data().createdDate.toDate()) + '</p>';
                output += '<p>Task Due On: ' + formatDateTime(doc.data().dueDate.toDate()) + '</p>';
                let status = "";
                if(doc.data().done === true){
                    status = "Completed";
                }else{
                    status = "Pending";
                }
                output += '<p>Status: ' + status +'</p>';
                output += '<p>Description: ' + doc.data().taskDelegation + '</p>'
                output += '</div>';

                document.getElementById("taskDetails").innerHTML = output;

                await db.collection("tasks").doc(taskId).collection("time_entry").get().then(function(querySnapshot) {
                    output = '<h4>Members Working On This Task</h4>';
                    let i = 0;
                    querySnapshot.forEach(function(time_entry) {
                        output += '<div class="card-header mt-3">';
                        output += '<p>Student Email: ' + time_entry.id + '</p>';
                        output += '<p>Task Delegation: ' + doc.data().percentage[i] + '%</p>';
                        if(typeof time_entry.data().startDate === 'undefined'){
                            output += '<p>Started on: ' + 'No Records' + '</p>';
                            output += '<p>Ended on: ' + 'No Records' + '</p>';
                        }else{
                            let startDate = formatDateTime(time_entry.data().startDate.toDate());
                            let endDate = formatDateTime(time_entry.data().endDate.toDate());
                            output += '<p>Started on: ' + startDate + '</p>';
                            output += '<p>Ended on: ' + endDate + '</p>';
                        }
                        if(time_entry.data().complete){
                            output += "Status: Completed";
                            output += '<div class="float-right alert alert-success" role="alert" style="padding: 4px; vertical-align: center">Completed</div>';
                        }else{
                            if(time_entry.id === userEmail){
                                output += "Status: Pending";
                                let href = "student_time_entry.html?projectId=" + projectId + "&taskId=" + taskId + "&projectName=" + projectName;
                                output += '<a href="' + href + '">';
                                output += '<button type="button" class="btn btn-secondary btn-sm float-right" >Enter time</button></a>';
                            }else{
                                output += "Status: Pending";
                            }

                        }

                        output += '<br><br></div>';
                        i++;
                    });
                    document.getElementById("taskAssignment").innerHTML = output;
                }).catch(function(error) {
                    console.log("Error getting document:", error)
                });

                db.collection("comments").where("task", "==", taskId)
                    .onSnapshot(function(querySnapshot) {
                        custom_message='this.setCustomValidity("Comment cannot be empty")'
                        clear_invalid="setCustomValidity('')"
                        
                        output = '<h4>Comments On This Task</h4>';
                        output += '<div class="card-header mt-3">';
                        output += '<input type="text" id="comment" name="comment" required> <br><br>';
                        output += '<a href="#" style="text-decoration-line: none; ">';
                        output += '<button class="btn btn-warning float-right" id="comment_button" onClick="event.preventDefault(); addComment();">Comment</button></a>';
                        output += '<br><br>';
                        output+='<div id="comments">'
                        if(querySnapshot.size !== 0){
                            querySnapshot.forEach(function(comments) {
                                output += '<p>' + '<b>'+comments.data().commentedBy+'</b>' + '<br>' + comments.data().comment + '</p>'
                            });
                        }else{
                            output += '<div class="alert alert-warning" role="alert">';
                            output += 'Currently, there are no comments on this task</div>';
                        }
                        
                        output +='</div>'
                        document.getElementById("taskComments").innerHTML = output;
                    }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function formatDateTime(dateTime){
    let day = dateTime.getDate();
    let month = dateTime.getMonth() + 1;
    let year = dateTime.getFullYear();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let time = hours + ':' + minutes + ampm;
    if (day.toString().length < 2) day = '0' + day;
    if (month.toString().length < 2) month = '0' + month;

    return day + '/' + month + '/' + year + " " + time;
}

fetchSingleTask();
function addComment(){
       var comment = document.getElementById('comment');
       var valid = comment.checkValidity(); 
       console.log(valid)
       if(valid){
       // - Code to execute when all DOM content is loaded. 
       let urlParams = new URLSearchParams(window.location.search);
       taskId = urlParams.get('taskId');
       db.collection('comments').add({
                    comment: comment.value,
                    commentDate: new Date(),
                    commentedBy: stud_email,
                    task: taskId
       })
       console.log("Comment added")
       }
       else{
          alert("Comment cannot be empty");
       
       }
}