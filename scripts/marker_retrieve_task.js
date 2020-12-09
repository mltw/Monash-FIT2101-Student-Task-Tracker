function fetchTasks() {
    let urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get('projectId');
    projectName = urlParams.get('projectName');
    document.getElementById("projectName").innerText = projectName;
    db.collection("tasks").where("project", "==", projectId)
        .onSnapshot(function (querySnapshot) {
            let output = "";
            if(querySnapshot.size !== 0){
                querySnapshot.forEach(function(doc) {
                    output += '<div class="card-header" style="height: 70px; padding: 20px 20px; font-size: 20px; cursor: pointer" onclick="markerSelectThisTask(\'' + doc.id + '\')">';
                    output += doc.data().title;
                    // if(doc.data().done === true){
                    //     output += '<div class="float-right alert alert-success" role="alert" style="padding: 4px; vertical-align: center">Completed</div>'
                    // }else{
                    //     output += '<div class="float-right alert alert-warning" role="alert" style="padding: 4px; vertical-align: center">Pending</div>'
                    // }
                    output += "</div><br>";
                });
            }else{
                output = '<div class="alert alert-warning" role="alert">';
                output += 'Currently, there are no tasks for this project</div>';
            }
            document.getElementById("tasks-module").innerHTML = output;
        })
}

function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ampm;
}

function markerSelectThisTask(taskId) {
    window.location.href = "marker_task_page.html?projectId=" + projectId + "&taskId=" + taskId + "&projectName=" + projectName;

}