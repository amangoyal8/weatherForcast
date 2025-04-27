import { useState, useEffect, useRef } from "react";
import axios from "axios";
import WeatherCard from "../Components/WeatherCard";
import "./Weather.css";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
function Weather() {
  const [ip, setIp] = useState("");
  const [ipInfo, setIpInfo] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [todayIndex, setTodayIndex] = useState(0);
  const [filterRange, setFilterRange] = useState([])
  useEffect(() => {
    const getIp = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        const data = response.data;
        setIp(data.ip);

        const infoResponse = await axios.get(`https://ipinfo.io/${data.ip}/json`);
        setIpInfo(infoResponse.data);
      } catch (err) {
        console.error("Error fetching IP info: ", err);
      }
    };

    getIp();
  }, []);

  useEffect(() => {
    const handleWeatherData = async () => {
      if (ipInfo?.city) {
        try {
          const weatherres = await axios.post("http://localhost:5000/api/weather/forecast", { city: ipInfo?.city });
          setWeatherInfo(weatherres?.data?.data || []);
        } catch (error) {
          console.error("Error fetching weather data: ", error);
        }
      }
    };
    handleWeatherData();
  }, [ipInfo]);

  const sortedData = weatherInfo.sort((a, b) => new Date(a.date) - new Date(b.date));

  const today = new Date();
  const formatDate = (date) => date.toISOString().split('T')[0];
  const [dates, setDates] = useState([])

  useEffect(() => {
    if (sortedData.length > 0) {
      sortedData.forEach((item) => {
        const newDates = sortedData.map(item => item.date);
        setDates(newDates);
      })
      const todayFormatted = formatDate(today);
      const index = sortedData.findIndex(item => formatDate(new Date(item.date)) === todayFormatted);
      setTodayIndex(index);
    }
  }, [sortedData]);

  let filteredWeather = [];

  if (currentPage === 0) {
    if (todayIndex >= 0) {
      filteredWeather = sortedData.slice(todayIndex, todayIndex + 1);
    }
  } else if (currentPage < 0) {
    const start = Math.max(todayIndex + currentPage * 3, 0);
    const end = todayIndex;
    filteredWeather = sortedData.slice(start, end);
  } else {
    const start = todayIndex + 1 + (currentPage - 1) * 3;
    const end = start + 3;
    filteredWeather = sortedData.slice(start, end);
  }

  const handlePrev = () => {
    setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
  };





  const rangePickerRef = useRef(null);


  const handleClear = () => {
    setFilterRange([])
    if (rangePickerRef?.current) {
      // rangePickerRef?.current?.setValue(null);
    }
  }
  const handleDate = (obj, strings) => {
    const fromDate = new Date(strings[0])
    const toDate = new Date(strings[1])
    console.log(fromDate, toDate)
    const filterData = sortedData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= fromDate && itemDate <= toDate;
    });

    console.log(filterData);
    setFilterRange(filterData);
  }
  return (
    <>
      <div className="main">
        <div className="left">
          <RangePicker
            ref={rangePickerRef}
            showTime={false}
            allowClear={true}
            onChange={handleDate}
            style={{
              border: '2px solid #000',
              borderRadius: '4px',
              color: "black",
              padding: '20px'
            }}
          />
        </div>
        <div className="right">
          <h1>Weather Forecast</h1>

          <h2>Your Ip: {ip}</h2>
          <h2>Your City: {ipInfo?.city}</h2>

          <div className="navigation-buttons">
            <button onClick={handlePrev} disabled={!sortedData.length}>Prev</button>
            <button onClick={handleClear}>Clear</button>

            <button onClick={handleNext} disabled={!sortedData.length}>Next</button>
          </div>

          <div className="forecast-container">
            {
              filterRange?.length > 0
                ? filterRange.map((weather, index) => (
                  <WeatherCard key={index} weather={weather} />
                ))
                : filteredWeather.length > 0
                  ? filteredWeather.map((weather, index) => (
                    <WeatherCard key={index} weather={weather} />
                  ))
                  : <p>No data available for these dates.</p>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Weather;
