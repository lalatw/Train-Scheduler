var myData = [ ];
var trainName = [];
var destination = []; 
var frequency = [] ;
var firstTrainTime = [];


$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDtNHrpi8W6myt8mFYYw2sdrQfNx8dijEk",
        authDomain: "lalatw-2d435.firebaseapp.com",
        databaseURL: "https://lalatw-2d435.firebaseio.com",
        projectId: "lalatw-2d435",
        storageBucket: "lalatw-2d435.appspot.com",
        messagingSenderId: "946474002445"
    };
    firebase.initializeApp(config);

    var dataRef = firebase.database();


    //push user input to Firebase to store data
    $(document).on("click", "#submit-button",  function(event) {
        
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        frequency = $("#frequency").val().trim();
        firstTrainTime = moment($("#first-traintime").val().trim(), "HH:mm").format("X");


        dataRef.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            firstTrainTime: firstTrainTime,

        });


        $("#train-name").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#first-traintime").val("");

    });  


    //Get data from Firebase database to calculate and display
    dataRef.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var firstTrainTime = childSnapshot.val().firstTrainTime;

        console.log(trainName);
        console.log(destination);
        console.log(frequency);
        console.log(firstTrainTime);
        
        var nextTrainTime = moment.unix(firstTrainTime);
        var timeNow = moment();

        while ( nextTrainTime.diff(timeNow) < 0) {
            nextTrainTime.add(frequency, 'm');
        }
        
        var timeDiff = moment.duration(nextTrainTime.diff(timeNow));
 

        var newRow = $("<tr>").append(
            $("<th>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(moment(nextTrainTime).format("HH:mm")),
            $("<td>").text(Math.floor(timeDiff.asMinutes())),
            $("<td>").append('<button class="remove-button" info="'+childSnapshot.key+'" >X</button>')
        );
    
        $("#main-table").append(newRow);


    }, function(errorObject) {
        console.log("Errors code: " + errorObject.code);
    });


    //remove button function
    $(document).on("click", ".remove-button", function (event) {
        var key = $(this).attr("info");
        console.log(key);
        dataRef.ref().child(key).remove();
        location.reload();

    })


})







