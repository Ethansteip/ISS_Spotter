/*
* index2.js - rafctoring ISS functions to use promises.
*/

const { nextISSTimesForMyLocation } = require('./iss_promised.js');

// Format and print the next flyover times for your location
const printPassTimes = function(passTimes) {

  for (const time of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(time.risetime);
    const duration = time.duration;
    console.log(`Next pass at ${datetime} for ${duration} second!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error);
  });
