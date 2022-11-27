// index.js

const { nextISSTimesForMyLocation } = require('./iss');

// Format and print the next flyover times for your location
const printPastTimes = function(passTimes) {

  for (const time of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(time.risetime);
    const duration = time.duration;
    console.log(`Next pass at ${datetime} for ${duration} second!`);
  }
};

// Call the main function that triggers the 3 other API calls in order to calculate flyover times!
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the flyover times for my location.
  printPastTimes(passTimes);
});