import React ,{useEffect, useState,useContext} from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import DisplayWeather from "./DisplayWeather";
import { locationName } from '../context/location'
import { MdAccessTime } from "react-icons/md";

const MainWeatherCard = (props) => {
  const currentLocation = useContext(locationName);
  const [currentTime, setCurrentTime] = useState("")
  const [location, setLocation] = useState("")
  
  function getCurrentTime() {
    const time = new Date();
    const resTime = time.toLocaleTimeString().indexOf(":")==1?"0"+time.toLocaleTimeString():time.toLocaleTimeString();
    // console.log(resTime)
    setCurrentTime(resTime.substring(0,5)+resTime.substring(8,11));
  }

  function handleLocationInput(e){
    let locationinp = e.target.value;
    setLocation(locationinp)
  }

  function findWeather(){
    if(location.length == 0){
      alert("Please Enter a valid Location .");
    }
    else{
      // console.log("Searching location is : ",location);
      props.setSearchLocation(location);
      setLocation("");
    }
  }

  useEffect(() => {
    // console.log("This is second useeffect. This run one time.")
    getCurrentTime();
    const intervalId = setInterval(getCurrentTime,2000);
    return ()=> clearInterval(intervalId);
  }, [])

  return (
    <div className="w-full lg:w-[65%] sm:h-5/6">
      <div className="mainWeatherCard rounded-md p-10 flex flex-col justify-between">
        <div className="flex justify-center items-center flex-col sm:flex-row sm:justify-between flex-wrap gap-3">
          <h2 className="logo font-bold text-3xl text-white">Weather App</h2>
          <div className="flex flex-col items-center">
            <FaLocationDot size={50} id="locationIcon"/>
            <p className="font-bold text-white md:text-black">{currentLocation}</p>
            <p className="font-bold text-white md:text-black flex items-center justify-center gap-2"><MdAccessTime size={20}/> {currentTime}</p>
            {/* <p>Time</p> */}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center mt-3">
          <input
            type="text"
            placeholder="Enter a place Name eg.(Kolkata)"
            className="w-4/5 rounded-md p-2"
            value={location}
            onChange={handleLocationInput}
          />
          <button className="ml-5" onClick={findWeather}>
            <FaSearch size={25}/>
          </button>
        </div>
      </div>
      <div className="weatherCards h-[30%]">
        <DisplayWeather />
      </div>
    </div>
  );
};

export default MainWeatherCard;
