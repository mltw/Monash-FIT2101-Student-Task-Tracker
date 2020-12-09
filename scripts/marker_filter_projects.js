
db.collection("private").get()
    .then(function(querySnapshot) {
        let output = "<option value=\"\" disabled selected hidden>Select unit</option>";
        output += '<option value="all" >All units</option>';
        if(querySnapshot.size !== 0){
            querySnapshot.forEach(function(doc) {
                output +="<option value="+ doc.data().name+">"+doc.data().name+"</option>";
            });
        }
        document.getElementById("units").innerHTML += output;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

async function fetch_tutorial(){
    const unit = document.querySelector('#units');
    var unit_doc= await db.collection("private").doc(unit.value).get();
    var unit_data=await unit_doc.get('tutorial');
    let output = "<option value=\"\" disabled selected hidden>Select tutorial slot</option>";
    output += '<option value="all" >All tutorial slots</option>';
    db.collection("projects").where("createdBy", "==", user_email)
        .get()
        .then(function(querySnapshot) {
            let output = "";
            if(querySnapshot.size !== 0){
                querySnapshot.forEach(function(doc) {
                    if(unit.value === 'all'){
                        output += '<button type="button" class="btn btn-light" onclick="markerSelectThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                        output += doc.data().projectName + '</p></button>';
                        output += '<span style="padding-left: 40px"></span>';
                    }
                    else if (doc.data().unit === unit.value){
                        output += '<button type="button" class="btn btn-light" onclick="markerSelectThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                        output += doc.data().projectName + '</p></button>';
                        output += '<span style="padding-left: 40px"></span>';
                    }
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
    if(unit.value === 'all'){
        output = "<option value=\"\" disabled selected hidden>Select tutorial slot</option>";
    }else if(unit_data.length !== 0){
        unit_data.forEach(function(tutorial_group) {
            output +="<option value="+ tutorial_group+">"+tutorial_group+"</option>";
        });
    }
    else{
        console.log(unit.value+" does not have any tutorial groups")
        alert(unit.value+" does not have any tutorial groups")
    }
    document.getElementById("tutorial_groups").innerHTML = output;

}

async function fetch_projects(){
    const unit = document.querySelector('#units');
    const tutorial = document.querySelector('#tutorial_groups');
    db.collection("projects").where("createdBy", "==", user_email)
        .get()
        .then(function(querySnapshot) {
            let output = "";
            if(querySnapshot.size !== 0){
                querySnapshot.forEach(function(doc) {
                    if(tutorial.value === 'all' && doc.data().unit === unit.value){
                        output += '<button type="button" class="btn btn-light" onclick="markerSelectThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                        output += doc.data().projectName + '</p></button>';
                        output += '<span style="padding-left: 40px"></span>';
                    }
                    else if (doc.data().unit === unit.value && doc.data().tutorial == tutorial.value){
                        output += '<button type="button" class="btn btn-light" onclick="markerSelectThisProject(\'' + doc.id + '\',\'' + doc.data().projectName + '\')"><i class="fa fa-folder" style="font-size: 80px; color: #F0E68C"></i><p>';
                        output += doc.data().projectName + '</p></button>';
                        output += '<span style="padding-left: 40px"></span>';
                    }
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