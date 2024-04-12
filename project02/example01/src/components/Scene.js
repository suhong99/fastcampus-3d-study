import React, { useEffect, useState } from 'react';
import Earth from './Earth';
import Weather from './Weather';
import { getCityWeather } from '../utils/weatherApi';
import { cities } from '../utils/cities';
import Lights from './Lights';

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
      <Lights />
      <Earth />
      {content?.map(({ city, weatherData }, i) => {
        const angle = (i / (content.length - 1)) * Math.PI;
        const raduis = 2;
        const x = raduis * Math.cos(angle);
        const y = raduis * Math.sin(angle) - 1;
        const weather = weatherData.weather[0].main.toLowerCase();
        return (
          <Weather
            key={city}
            position={[x, y - 1, 0]}
            rotaionY={i + 1}
            weather={weather}
          />
        );
      })}
    </>
  );
};

export default Scene;
