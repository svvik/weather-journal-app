/* Global Variables */
const zip = document.querySelector("#zip");
const code = document.querySelector("#code");
const feelings = document.querySelector("#feelings");
const generate = document.querySelector("#generate");
//base URL for OpenWeatherMap API
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
// Personal API Key for OpenWeatherMap API
const apiKey = "34ba7be286f3a8827c7f6b1e5a7f79cb&units=imperial";
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
//add listener on "generate" button
generate.addEventListener("click", performAction);
//generate call URL in format:{base URL}{zip code},{country code}&appid={API key} //
function performAction(e) {
  if (zip.value.length == 0) {
    alert("enter valid zip");
  } else if (code.value.length != 2) {
    alert("enter valid country code, should be 2 letters");
  } else if (feelings.value.length == 0) {
    alert("enter your feelings");
  } else {
    let callURL = `${baseURL}${zip.value},${code.value}&appid=${apiKey}`;
    getWeatherData(callURL)
      .then((data) => {
        const postURL = "/postdata";
        const info = {
          location: data.name,
          country: code.value,
          date: newDate,
          temperature: data.main.temp,
          weather: data.weather[0].description,
          icon: data.weather[0].icon,
          feelings: feelings.value,
        };
        console.log(info);
        postData(postURL, info);
      })
      .then(updateUI)
      .catch((error) => alert(error.message));
  }
}
//asynchronous function to fetch the data from the app endpoint(OpenWeatherMap API)
const getWeatherData = async (callURL) => {
  const res = await fetch(callURL);
  const data = await res.json();
  if (data.cod != 200) {
    throw new Error(data.message);
  }
  console.log(data);
  return data;
};

//asynchronous function to post the data to the server side
const postData = async (postURL, info) => {
  const response = await fetch(postURL, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });
  const resp = await response.text();
  console.log(resp);
  return resp;
};

//asynchronous function to retrieve data from the server side and update UI side
const updateUI = async () => {
  const retrieveData = await fetch("/getdata");
  const allData = await retrieveData.json();
  console.log(allData);
  //update DOM elements
  document.getElementById("entryHolder").classList.add("entry");
  document.getElementById("temp").innerHTML =
    Math.round(allData.temperature) + "&deg" + "F";
  document.getElementById("content").innerHTML =
    "I am feeling: " + allData.feelings;
  document.getElementById("date").innerHTML = allData.date;
  document.getElementById("location").innerHTML =
    allData.location + ", " + allData.country.toUpperCase();
  document.getElementById("icon").innerHTML =
    "<img src=https://openweathermap.org/img/wn/" +
    allData.icon +
    "@2x.png> <figcaption>" +
    allData.weather +
    "</figcaption>";
};
