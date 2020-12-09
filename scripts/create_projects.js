var marker_email;
firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
        console.log('logged in');
      var user = firebase.auth().currentUser;
      document.getElementById("dropdownMenuLink").innerHTML = "Logged In As "+ user.displayName;
      if (user != null) {
        marker_email = user.email;
      }
    }
  }
);
const createProjectForm = document.querySelector('#create-project-form');
createProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const unit_name = createProjectForm['units'].value;
    const tutorial_group = createProjectForm['tutorial_groups'].value;
    const group_name = createProjectForm['group_name'].value;
    const project_name = createProjectForm['pname'].value;
    const student_emails = createProjectForm['student_email'].value;
    const startDate = new Date(document.getElementById("start_date").value);
    const dueDate = new Date(document.getElementById("due_date").value);

    var student_array=student_emails.split(" ")
    var valid_project=true;
    var email_count=0;
    if(startDate.getTime() > dueDate.getTime()){
        valid_project=false;
        alert("Project start date cannot be later than due date.");
    }

    student_array.forEach(async function confirm_student(student_email){
        await firebase.auth().fetchSignInMethodsForEmail(student_email)
        .then((signInMethods) => {
            email_count++;
            if (signInMethods.length) {
            // The email already exists in the Auth database. Do nothing.    
            } 
            else {
            // User does not exist. Notify user to enter a valid email
                valid_project=false;
                alert(student_email+" is not a registered user.");
            }
            
            if(valid_project &&email_count==student_array.length){
                db.collection('projects').add({
                    createdBy: marker_email,
                    projectName: project_name,
                    dueDate: dueDate,
                    groupName: group_name,
                    unit: unit_name,
                    tutorial: tutorial_group,
                    members: student_array,
                    memberCount: student_array.length,
                    startDate: startDate

                })
                createProjectForm.reset();
                alert("Successfully created project");
            }
        })
        .catch((error) => { 
            // Some error occurred.
            alert(error.message);
            console.log(error.message);
            createProjectForm.reset();
        });
        }

    )
        
})
    

       
   
    