let projectName, projectId;
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log('logged in');
      var user = firebase.auth().currentUser;
      document.getElementById("dropdownMenuLink").innerHTML = "Logged In As "+ user.displayName

      let urlParams = new URLSearchParams(window.location.search);
      projectName = urlParams.get('projectName');
      projectId = urlParams.get('projectId');
      document.getElementById("projectName").innerText = projectName;
}
else {
     console.log('not logged in');
}
})

function returnToProjectPage() {
     window.location.href = "student_project_page.html?projectId=" + projectId + "&projectName=" + projectName;
}

const createTaskForm = document.querySelector('#create-task-form');
createTaskForm.addEventListener('submit', (e) => {
     e.preventDefault();

     //get task info
     const taskName = createTaskForm['taskName'].value;
     const selectedDate = new Date(document.getElementById("selectedDate").value);
     const createdDate = new Date();
     const selectedTime = createTaskForm['selectedTime'].value;
     const studentEmails = createTaskForm['studentEmail'].value; // Make this an array of students
     const markDivision = createTaskForm['markDivision'].value;
     const studentPercentage = createTaskForm['studentPercentage'].value;
     // Getting the document id
     // const project = db.collection('projects').doc("FIT2101 Sprint 1");
     // console.log(project)
     // project.get().then(function(docRef) {
     //      console.log("Document exists: " + docRef.id)
     // })

     // To get the combined date and time
     const newMonth = selectedDate.getMonth() + 1;
     const finalDate = ' ' + selectedDate.getFullYear() + '-' + newMonth + '-' + selectedDate.getDate();
     if (selectedDate.getFullYear() < createdDate.getFullYear()) {
          alert("The due date inputted is invalid.");
          return
     } else if (selectedDate.getMonth() < createdDate.getMonth()) {
          alert("The due date inputted is invalid.");
          return
     } else if (selectedDate.getDate() < createdDate.getDate()) {
          alert("The due date inputted is invalid.");
          return
     }

     const dueDate = new Date(finalDate + '  ' + selectedTime);

     var total = 0;
     var percentage_array = studentPercentage.split(" ");
     for (i = 0; i < percentage_array.length; i++) {
          percentage_array[i] = parseInt(percentage_array[i], 10);
          total += percentage_array[i];
     }
     if (total > 100 || total < 100) {
          alert("Students' percentage should amount to 100.");
          return
     }
     var student_array = studentEmails.split(" ");
     var valid_task = true;
     var email_count = 0;

    student_array.forEach(async function confirm_student(studentEmail){
        await firebase.auth().fetchSignInMethodsForEmail(studentEmail)
        .then((signInMethods) => {
            email_count++;
            if (signInMethods.length) {
            // The email already exists in the Auth database. Do nothing.
            }
            else {
            // User does not exist. Notify user to enter a valid email
                valid_task=false;
                alert(studentEmail+" is not a registered user.");
            }

            if(valid_task &&email_count==student_array.length){
                db.collection('tasks').add({
                    project: projectId,
                    createdDate: createdDate,
                    dueDate: dueDate,
                    assignedTo: student_array,
                    taskDelegation: markDivision,
                    title: taskName,
                    percentage: percentage_array
               })
               .then(function(docRef) {
                    docId = docRef.id;
                    for (i = 0; i < student_array.length; i++) {
                        db.collection('tasks').doc(docId).collection("time_entry").doc(student_array[i]).set({
                             complete: false
                        })
                   }
               })
                createTaskForm.reset();
                alert("Successfully created task");
           }
      })
      .catch((error) => {
           alert(error.message);
           console.log(error.message);
           createTaskForm.reset();
      });
})
})
