/*
* iss_promised.js - rafctoring ISS functions to use promises.
*/

const request = require('request-promise-native');

// Fetch the IP address using promises
const fetchMyIP = () => {
  return request(`https://api.ipify.org/?format=json`);
};

// Fetch the lat and lon using promises
const fetchCoordsByIP = (body) => {
  const data = JSON.parse(body);
  const ip = data.ip;
  return request(`http://ipwho.is/${ip}`);
};

// Fetch the flyby time according to coords
const fetchFlyoverTimes = (body) => {
  const data = JSON.parse(body);
  const coords = {latitude: data.latitude, longitude: data.longitude};
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  return request(url);
};

const nextISSTimesForMyLocation = (callBack) => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchFlyoverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};



module.exports = { nextISSTimesForMyLocation };





