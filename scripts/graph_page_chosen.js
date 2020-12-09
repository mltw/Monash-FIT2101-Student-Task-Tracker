let taskId, taskName, projectId, projectName;
async function fetchGraph() {
     let urlParams = new URLSearchParams(window.location.search);
     taskId = urlParams.get('taskId');
     taskName = urlParams.get('taskName');
     let output = {}

     await db.collection('tasks').doc(taskId).get().then(function(doc){
          output.title = doc.data().title;
          output.percentage = doc.data().percentage;
     })
     await db.collection('tasks').doc(taskId).collection('time_entry').get().then(function(querySnapshot){
          let tasks = []
          querySnapshot.forEach(function(doc){
               let timeEntry = {}
               if(doc.data().startDate){
                    let timeSpent = Math.round(Math.abs(doc.data().endDate.toDate() - doc.data().startDate.toDate()) / 36e5, 2);
                    timeEntry.email = doc.id;
                    timeEntry.completed = doc.data().complete;
                    timeEntry.timeSpent = timeSpent;
                    timeEntry.enteredTime = true;
               }else{
                    timeEntry.email = doc.id;
                    timeEntry.completed = doc.data().complete;
                    timeEntry.enteredTime = false;
               }
               tasks.push(timeEntry);
          });
          output.tasks = tasks;
     })
     return output;
}

function goToGraphPage(){
     let urlParams = new URLSearchParams(window.location.search);
     projectId = urlParams.get('projectId');
     projectName = urlParams.get('projectName');
     window.location.href = "marker_graph_page.html?projectId=" + projectId + "&projectName=" + projectName;
}
