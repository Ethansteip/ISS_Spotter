/*
* iss.js - holds the 3 main api calls as well as the final function call
*/

const request = require('request');

/*
*
*
* API Call #1 - Finds your IP address and return either an error message or your IP address.
*
*
*/

const fetchMyIP = (callBack) => {
  request(`https://api.ipify.org/?format=json`, function(error, response, body) {
    //console.log("Status Code: ", response.statusCode);
    if (error) {
      callBack(error, null);
      return;
    }
    // Handle response codes other than 200
    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching IP. Reponse: ${body}`;
      callBack(Error(message), null);
      return;
    }
    // Handle IP data
    const data = JSON.parse(body);
    return callBack(null, data.ip);
  });
};

/*
*
*
* API Call #2 - Takes your given IP address and returns the latitudue and longitude coordinates as
* an object, or returns an error message.
*
*/

const fetchCoordsByIP = (ip, callBack) => {
  request(`http://ipwho.is/${ip}`, function(error, response, body) {

    // Parse the reponse
    const data = JSON.parse(body);
    if (data.success === false) {
      const errorMessage = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callBack(Error(errorMessage), null);
      return;
    }
    // Handle response codes other than 200
    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching IP. Reponse: ${data}`;
      callBack(Error(message), null);
      return;
    }
    // Handle IP data
    let latLong = {};
    latLong = { latitude: data.latitude, longitude: data.longitude};
    //console.log(latLong);
    return callBack(null, latLong);
  });
};

/*
*
*
* API Call #3 - Fetch flyover times for the ISS with the given coordinates from call #2.
*
*/

const fetchFlyoverTimes = (coords, callBack) => {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, function(error, response, body) {

    // Parse the reponse
    const data = JSON.parse(body);
    // check for reponse failure
    if (data.message !== "success") {
      const errorMessage = `Success status was ${data.message} for coords lat: ${coords.latitude}, Long ${coords.longitude}`;
      callBack(Error(errorMessage), null);
      return;
    }
    // Handle response codes other than 200
    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching IP. Reponse: ${data}`;
      callBack(Error(message), null);
      return;
    }
    // Handle flyover response
    return callBack(null, data.response);
  });
};

/*
*
*
* Final function call - nextISSTimesForMyLocation will pull together all three of the earlier API calls to
* give us the results of when the next ISS Fly over will be for a given location.
*
*
*/

const nextISSTimesForMyLocation = (callBack) => {

  // Fetch IP address
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!", error);
      return;
    }
    // Fetch geo coordinates using ip address
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
      fetchFlyoverTimes(coords, (error, response) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }
        callBack(error, response);
      });
    });
  });


};



module.exports = { nextISSTimesForMyLocation };