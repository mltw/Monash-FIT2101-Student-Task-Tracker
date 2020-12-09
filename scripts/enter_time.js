const enterTimeForm = document.querySelector('#time-entry-form');
var urlParams = new URLSearchParams(window.location.search);
var taskId=urlParams.get('taskId')
var projectId=urlParams.get('projectId')
var projectName=urlParams.get('projectName')
var markComplete = enterTimeForm['complete']
var complete=false
// var user = firebase.auth().currentUser;

async function getDateTime(taskId,user){
    const taskDoc=await db.collection("tasks").doc(taskId).get()
    document.getElementById('task').innerText+=" "+taskDoc.get('title')
    document.getElementById('student_rp').innerText+=" "+taskDoc.get('assignedTo').join(', ')
    document.getElementById('duedate').innerText+=" "+Date(taskDoc.get('dueDate'))

    const timeDoc= await db.collection("tasks").doc(taskId).collection("time_entry").
    doc(user).get()
    if(timeDoc.get('startDate')!=null && timeDoc.get('endDate')){
        const startDate= timeDoc.get('startDate').toDate();
        const endDate = timeDoc.get('endDate').toDate();
        
        //add offset so it matches local time
        const offset = startDate.getTimezoneOffset()
        local_startDate = new Date(startDate.getTime() - (offset*60*1000))
        local_endDate = new Date(endDate.getTime() - (offset*60*1000))
        //get date from ISO string
        enterTimeForm['startDate'].value=local_startDate.toISOString().split('T')[0]
        enterTimeForm['endDate'].value=local_endDate.toISOString().split('T')[0]

        //get time from ISO string
        enterTimeForm['startTime'].value=local_startDate.toISOString().split('T')[1].slice(0,5)
        enterTimeForm['endTime'].value=local_endDate.toISOString().split('T')[1].slice(0,5)
    }
    
}

async function enterDate(taskId,user){
    const timeDoc= await db.collection("tasks").doc(taskId).collection("time_entry").
        doc(user).get()

    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const startTime = enterTimeForm['startTime'].value;
    const endTime = enterTimeForm['endTime'].value;
    
    const startDateTime= new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),
    startTime.slice(0,2),startTime.slice(3,5))
    const endDateTime= new Date(endDate.getFullYear(),endDate.getMonth(),endDate.getDate(),
    endTime.slice(0,2),endTime.slice(3,5))
    
    var valid_time=true
    if(startDateTime>endDateTime) {
        // User does not exist. Notify user to enter a valid email
        valid_time=false 
        alert("The start date cannot be later than the completed date.")  
    }
        
    const timeRef=await db.collection("tasks").doc(taskId).collection("time_entry").doc(user)
    var complete_query = await timeDoc.get('complete')
    if(complete_query){
        alert("The time taken has been finalised, further changes are not possible.") 
    }
    if(valid_time&&!complete_query){
        if(timeDoc.get('startDate')!=null && timeDoc.get('endDate')){
            timeRef.update({
                complete: complete,
                endDate: firebase.firestore.Timestamp.fromDate(endDateTime),
                startDate:firebase.firestore.Timestamp.fromDate(startDateTime)
            })
        }
        else{
            timeRef.set({
                complete: complete,
                endDate: firebase.firestore.Timestamp.fromDate(endDateTime),
                startDate:firebase.firestore.Timestamp.fromDate(startDateTime)
            }) 
        }
        alert("Time successfully saved in database.")
    }
}


enterTimeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    enterDate(taskId,user.email)
});

markComplete.addEventListener( 'change', function() {
    if(this.checked) {
        complete=true
    } 
});
