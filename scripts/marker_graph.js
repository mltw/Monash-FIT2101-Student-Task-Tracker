let projectId, projectName;
async function fetchTasks() {
    let urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get('projectId');
    projectName = urlParams.get('projectName');
    db.collection("tasks").where("project", "==", projectId)
        .onSnapshot(function (querySnapshot) {
            let output = "";
            if(querySnapshot.size !== 0){
                querySnapshot.forEach(function(doc) {
                    output += '<div class="card-header" style="height: 70px; padding: 20px 20px; font-size: 20px; cursor: pointer" onclick="markerSelectThisGraph(\'' + doc.id + '\',\'' + doc.data().title +'\')">';
                    output += doc.data().title;
                    output += "</div><br>";
                });
            }else{
                output = '<div class="alert alert-warning" role="alert">';
                output += 'Currently, there are no tasks for this project</div>';
            }
            document.getElementById("graph-tasks-module").innerHTML = output;
        })
}

function markerSelectThisGraph(taskId, taskName) {
     window.location.href = "graph_page_chosen.html?taskId=" + taskId + "&taskName=" + taskName + "&projectId=" + projectId + "&projectName=" + projectName;
}

function returnToProjectPage() {
     window.location.href = "marker_project_page.html?projectId=" + projectId + "&projectName=" + projectName;
}
