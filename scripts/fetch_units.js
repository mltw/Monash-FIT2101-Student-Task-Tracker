db.collection("private").get()
.then(function(querySnapshot) {
    let output = "";
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
