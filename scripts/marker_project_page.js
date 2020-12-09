let projectId, projectName;
var task_arr=[];
function displayProjectContribution(){
    let urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get('projectId');
    projectName = urlParams.get('projectName');
    document.getElementById("projectName").innerText = projectName;
    db.collection("projects").doc(projectId)
        .get()
        .then(function(doc) {
            let output = "";
            for(let i = 0; i < doc.data().members.length; i++){
                output += '<a data-toggle="collapse" href="#toggle-' + i + '" aria-expanded="false" aria-controls="collapseExample"><div class="card-header">';
                output += doc.data().members[i];
                output += '</div></a>';
                output += '<div class="collapse" id="toggle-' + i + '"><div class="card card-body"><h4>Assigned Tasks</h4>';
                output += '<div id=details-' + i + '>';
                output += '<div class="alert alert-warning" role="alert">';
                output += 'Currently, there are no task assigned to this student</div>';
                output += '</div>';
                output += '</div></div><br>';
                getTaskDetails(doc, i);
            }
            document.getElementById("projectTasks").innerHTML = output;
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
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

function getTaskDetails(doc, i){
    let output = "";
    db.collection("tasks").where('assignedTo', 'array-contains', doc.data().members[i])
        .get()
        .then(async function (querySnapshot) {
            if (querySnapshot.size !== 0) {
                querySnapshot.forEach(await async function (task,index) {
                    if (task.data().project === projectId) {
                        let status, startDate, endDate;
                        await db.collection("tasks").doc(task.id).collection("time_entry").doc(doc.data().members[i]).get().then(async function (timeEntry) {
                            console.log(timeEntry.data());
                            if (timeEntry.data().complete === true) {
                                status = "Completed";
                            } else {
                                status = "Pending";
                            }
                            if (typeof timeEntry.data().startDate === 'undefined') {
                                startDate = "No Records";
                                endDate = 'No Records';
                            } else {
                                startDate = formatDateTime(timeEntry.data().startDate.toDate());
                                endDate = formatDateTime(timeEntry.data().endDate.toDate());
                            }
                            let count=0;
                            for(count=0;count<doc.data().members.length;count++){
                                if(task.data().assignedTo[count]==doc.data().members[i]){
                                    break;
                                }

                            }
                            output += '<table class="table table-bordered">\n' +
                                '  <thead>\n' +
                                '    <tr>\n' +
                                '      <th colspan="2">' + task.data().title + '</th>\n' +
                                '    </tr>\n' +
                                '  </thead>\n' +
                                '  <tbody>\n' +
                                '    <tr>\n' +
                                '      <th scope="row">Task Delegation</th>\n' +
                                '      <td>' + task.data().percentage[count] + '%</td>\n' +
                                '    </tr>\n' +
                                '    <tr>\n' +
                                '      <th scope="row">Status</th>\n' +
                                '      <td>' + status + '</td>\n' +
                                '    </tr>\n' +
                                '    <tr>\n' +
                                '      <th scope="row">Started on</th>\n' +
                                '      <td>' + startDate + '</td>\n' +
                                '    </tr>\n' +
                                '    <tr>\n' +
                                '      <th scope="row">Ended on</th>\n' +
                                '      <td>' + endDate + '</td>\n' +
                                '    </tr>\n' +
                                '  </tbody>\n' +
                                '</table>'
                            document.getElementById("details-" + i).innerHTML = output;
                            var obj={
                                "student email": doc.data().members[i],
                                "task name":task.data().title ,
                                "start date":startDate,
                                "end date": endDate,
                                "status":status,
                                "percentage":task.data().percentage[count]
                            }
                            task_arr.push(obj)
                           
                        }).catch(function(error) {
                            console.log("Error getting documents: ", error);
                        });
                    }
                });
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        
       
        
}

function convertArrayToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;
    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }
    
    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';
    
    keys = Object.keys(data[0]);
    
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    
    data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
    if (ctr > 0) result += columnDelimiter;
    
    result += item[key];
    ctr++;
    });
    result += lineDelimiter;
    });
    
    return result;
}

function downloadCSV() {
    var data, filename,button
    var csv = convertArrayToCSV({
    data: task_arr
    });
    
    if (csv == null) {
        return;
    }
    
    filename = projectName+'.csv';
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    button = document.getElementById('export');
    button.setAttribute('onclick', "window.open="+data);
    var link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
    button.setAttribute('onclick', "downloadCSV()");
}

function goToGraphPage(){
    window.location.href = "marker_graph_page.html?projectId=" + projectId + "&projectName=" + projectName;
}