


// Initialize Firebase
var config = {
  apiKey: "AIzaSyAO504ko3VhbXt8Y0CeDgZGB2chr4sGUBE",
  authDomain: "train-tracker-8c860.firebaseapp.com",
  databaseURL: "https://train-tracker-8c860.firebaseio.com",
  projectId: "train-tracker-8c860",
  storageBucket: "",
  messagingSenderId: "236827934170"
};
firebase.initializeApp(config);

var database = firebase.database();

// button to add train data
$("#submit-button").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#train-destination").val().trim();
  var firstTime = $("#first-time").val().trim().toString();
  var trainFrequency = $("#train-frequency").val().trim();

  // Creates local "temporary" object for holding data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: firstTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);


  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#train-destination").val("");
  $("#first-time").val("");
  $("#train-frequency").val("");
});

// 3. Create Firebase event for adding to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // console.log(firstTime);

  // Train Info
  // console.log(trainName);
  // console.log(trainDestination);
  // console.log(firstTime);
  // console.log(trainFrequency);

  // Assumptions
  var tFrequency = trainFrequency;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  // console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>Every " +
  trainFrequency + " Minutes</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + " Minutes</td></tr>");
});
