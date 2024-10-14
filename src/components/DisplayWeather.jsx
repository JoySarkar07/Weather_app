import React, { useContext, useEffect, useRef, useState } from "react";
import { FiCloudRain } from "react-icons/fi";
import { FiSun } from "react-icons/fi";
import { IoMdCloudOutline } from "react-icons/io";
import { BsSnow2 } from "react-icons/bs";

import forecastList from "../context/data";
import Loading from "./Loading";

//* for sun <FiSun />
//* for cloud <IoMdCloudOutline />
//* for snow <BsSnow2 />
//* for rain <FiCloudRain />

const DisplayWeather = () => {
  const forecastData = useContext(forecastList);
  const currentWeatherInd = useRef(0);
  const getDateObject = () => {
    return new Date();
  };

  function kelvinToFahrenheit(kelvin) {
    let res = ((kelvin - 273.15) * 9) / 5 + 32;
    return res.toFixed(2);
  }

  function displayWeatherLogo(logoText, logoSize = 20) {
    if (logoText == "Clear") {
      return <FiSun size={logoSize} />;
    } else if (logoText == "Clouds") {
      return <IoMdCloudOutline size={logoSize} />;
    } 
    else if (logoText == "Rain") {
      return <FiCloudRain size={logoSize} />;
    } 
    else if (logoText == "snow") {
      return <BsSnow2 size={logoSize} />;
    } 
    else {
      return "NOne";
    }
  }

  function formattedDateTime(dateTime) {
    let dt = getDateObject();
    let forecastTime = dateTime.substring(11, 16);
    if (parseInt(forecastTime.substring(0, 2)) == 0) {
      forecastTime = "12:00 AM";
    }
    else if (parseInt(forecastTime.substring(0, 2)) < 12) {
      forecastTime = forecastTime + " AM";
    }  
    else {
      forecastTime =
        (parseInt(forecastTime.substring(0, 2)) - 12 == 0
          ? 12
          : ((parseInt(forecastTime.substring(0, 2)) - 12)<10?"0"+(parseInt(forecastTime.substring(0, 2)) - 12):parseInt(forecastTime.substring(0, 2)) - 12)) +
        forecastTime.substring(2, 5) +
        " PM";
    }
    // console.log(dateTime);
    let resDateTime =
      dt.toString().substring(0, 3) +
      " " +
      dt.toString().substring(8, 10) +
      "th-" +
      dt.toString().substring(4, 7) +
      " " +
      dt.getFullYear() +
      " " +
      forecastTime;
    // console.log(forecastTime);
    // console.log(resDateTime);
    // console.log(dt, currentTime);
    return resDateTime;
  }

  const findcurrentWeatherInd = () => {
    let date = getDateObject();
    let currentHour = date.getHours();
    // console.log(currentHour);
    // console.log(forecastData[0].dt_txt.substring(11, 13));
    for (let i = 0; i < forecastData.length; i++) {
      if (parseInt(forecastData[i].dt_txt.substring(11, 13)) == currentHour) {
        currentWeatherInd.current = i;
        break;
      } else if (
        parseInt(forecastData[i].dt_txt.substring(11, 13)) > currentHour
      ) {
        if (i - 1 < 0) {
          currentWeatherInd.current = i;
          break;
        } else {
          currentWeatherInd.current = i - 1;
          break;
        }
      }
    }
  };

  return (
    <>
      {forecastData.length == 0 ? (
        <Loading />
      ) : (
        <div className="sm:flex w-full h-full ">
          {findcurrentWeatherInd()}
          <div className="today  w-full sm:w-2/5 flex p-5 justify-around items-center">
            <div >
              <h1 className="font-bold text-7xl sm:text-5xl md:text-6xl">
                {kelvinToFahrenheit(forecastData[currentWeatherInd.current].main.temp)}°
              </h1>
              <p className="daytime mt-3 rounded-lg text-center p-2">
                {formattedDateTime(forecastData[currentWeatherInd.current].dt_txt.substring(0, 16))}
              </p>
            </div>
            <div className="flex flex-col items-center">
              {displayWeatherLogo(forecastData[currentWeatherInd.current].weather[0].main, 80)}
              <p className="mt-3 font-bold p-2 md:p-0">
                {forecastData[currentWeatherInd.current].wind.speed.toFixed(2)}mph /{kelvinToFahrenheit(forecastData[currentWeatherInd.current].main.temp_min)}
                {forecastData
                  ? ""
                  : kelvinToFahrenheit(forecastData[currentWeatherInd.current].main.temp_min)}
                °
              </p>
            </div>
          </div>
          <div className="forecastCards w-full sm:w-[60%] h-full sm:flex justify-center">
            {forecastData.map((data, i) => {
              return (
                i > currentWeatherInd.current &&
                i <= currentWeatherInd.current + 5 && (
                  <div
                    key={i}
                    className="card w-full sm:h-full p-3 sm:w-[19%] ml-1 flex sm:flex-col justify-around items-center mt-2 sm:mt-0 rounded-md"
                  >
                    <p className="daytime px-2 text-center">
                      {formattedDateTime(data.dt_txt.substring(0, 16)).replace(
                        formattedDateTime(
                          data.dt_txt.substring(0, 16)
                        ).substring(13, 17),
                        ""
                      )}
                    </p>
                    {displayWeatherLogo(data.weather[0].main)}
                    <p>{kelvinToFahrenheit(data.main.temp)}°</p>
                    {/* kelvin to fahrenheit */}
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayWeather;
