import React, { useEffect, useState } from 'react';
import Earth from './Earth';
import Weather from './Weather';
import { getCityWeather } from '../utils/weatherApi';
import { cities } from '../utils/cities';

const API = process.env.REACT_APP_API_KEY;
const Scene = () => {
  const [content, setContent] = useState();

  useEffect(() => {
    const getCitiesWeather = () => {
      const promies = cities.map((city) => getCityWeather(city, API));

      Promise.all(promies)
        .then((weatherDataArray) => {
          setContent(weatherDataArray);
        })
        .catch((error) => {
          console.error('error', error);
        });
    };

    getCitiesWeather();
  }, []);

  return (
    <>
      <Earth position={[0, -2, 0]} />
      {content?.map(({ city, weatherData }, i) => {
        const position = [-1 + 0.5 * i, 0, 0];
        const weather = weatherData.weather[0].main.toLowerCase();
        return <Weather key={city} position={position} weather={weather} />;
      })}
    </>
  );
};

export default Scene;
