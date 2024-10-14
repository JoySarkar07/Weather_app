import "./App.css";
import MainWeatherCard from "./components/MainWeatherCard";
import { useEffect, useState} from "react";
import forecastList from "./context/data";
import { locationName } from "./context/location";
import { api_key } from "./secret/appsecretes";

function App() {
  const [currentLoc, setCurrentLoc] = useState("kolkata");
  const [weatherList, setWeatherList] = useState("");
  const [searchLocation, setSearchLocation] = useState("")

  function getCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          getLocatioName(lat, long);
        },
        (error) => {
          console.log("Error getting user location : " , error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  async function getLocatioName(lat, long) {
    let city = "";
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.address.city);
        city = data.address.city;
        setCurrentLoc(city);
      })
      .catch(() => {
        console.log("Internal Server Error");
      });
  }

  // useEffect(() => {
  //   getCurrentLocation();
  //   getWeatherData(currentLoc);
  //   console.log("This is first useeffect. This run one time.")
  // }, []);

  useEffect(() => {
    if(searchLocation.length != 0){
      getWeatherData(searchLocation);
      // console.log("searching...." + searchLocation);
      // console.log("This is first useeffect. This run when location change.")
    }
    else{
      getCurrentLocation();
      getWeatherData(currentLoc);
    }
  }, [currentLoc,searchLocation]);

  async function getWeatherData(location) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=${api_key}`;
    let response = "";
    try{
      try{
        response = await fetch(url);
      }
      catch(e){
        console.log("error is : ",e)
        return;
      }
      const data = await response.json();
      if(data.cod!="404"){
        setWeatherList(data.list);
      }
      else{
        alert(data.message);
      }
    }
    catch(e){
      console.log("error : ",e);
    }
  }

  return (
    <>
    {
      navigator.onLine?
      <locationName.Provider value={searchLocation.length==0?currentLoc:searchLocation}>
        <forecastList.Provider value={weatherList}>
          <div className="body">
            <MainWeatherCard setSearchLocation={setSearchLocation} />
          </div>
        </forecastList.Provider>
      </locationName.Provider>
      :alert("Please check your internet connection and try again !!!")
      }
    </>
  );
}

export default App;
