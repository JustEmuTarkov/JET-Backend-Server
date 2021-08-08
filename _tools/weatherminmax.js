const fs = require('fs');


const root = "../"
const weatherPath = root + "db/weather";

let minmax_data = {
	cloud: { min: 0, max: 0 },
	wind_speed: { min: 0, max: 0 },
	wind_direction: { min: 0, max: 0 },
	wind_gustiness: { min: 0, max: 0 },
	rain: { min: 0, max: 0 },
	rain_intensity: { min: 0, max: 0 },
	fog: { min: 0, max: 0 },
	temp: { min: 0, max: 0 },
	pressure: { min: 0, max: 0 },
	acceleration: { min: 0, max: 0 }
};
const weatherFiles = fs.readdirSync(weatherPath);
for(let file of weatherFiles){
	const data = require(weatherPath + "/" + file);
	if(minmax_data.cloud.min > data.weather.cloud)
		minmax_data.cloud.min = data.weather.cloud;
	if(minmax_data.cloud.max < data.weather.cloud)
		minmax_data.cloud.max = data.weather.cloud;

	if(minmax_data.wind_speed.min > data.weather.wind_speed)
		minmax_data.wind_speed.min = data.weather.wind_speed;
	if(minmax_data.wind_speed.max < data.weather.wind_speed)
		minmax_data.wind_speed.max = data.weather.wind_speed;

	if(minmax_data.wind_direction.min > data.weather.wind_direction)
		minmax_data.wind_direction.min = data.weather.wind_direction;
	if(minmax_data.wind_direction.max < data.weather.wind_direction)
		minmax_data.wind_direction.max = data.weather.wind_direction;

	if(minmax_data.wind_gustiness.min > data.weather.wind_gustiness)
		minmax_data.wind_gustiness.min = data.weather.wind_gustiness;
	if(minmax_data.wind_gustiness.max < data.weather.wind_gustiness)
		minmax_data.wind_gustiness.max = data.weather.wind_gustiness;

	if(minmax_data.rain.min > data.weather.rain)
		minmax_data.rain.min = data.weather.rain;
	if(minmax_data.rain.max < data.weather.rain)
		minmax_data.rain.max = data.weather.rain;
	
	if(minmax_data.rain_intensity.min > data.weather.rain_intensity)
		minmax_data.rain_intensity.min = data.weather.rain_intensity;
	if(minmax_data.rain_intensity.max < data.weather.rain_intensity)
		minmax_data.rain_intensity.max = data.weather.rain_intensity;
	
	if(minmax_data.fog.min > data.weather.fog)
		minmax_data.fog.min = data.weather.fog;
	if(minmax_data.fog.max < data.weather.fog)
		minmax_data.fog.max = data.weather.fog;
	
	if(minmax_data.temp.min > data.weather.temp)
		minmax_data.temp.min = data.weather.temp;
	if(minmax_data.temp.max < data.weather.temp)
		minmax_data.temp.max = data.weather.temp;
	
	if(minmax_data.acceleration.min > data.acceleration)
		minmax_data.acceleration.min = data.acceleration;
	if(minmax_data.acceleration.max < data.acceleration)
		minmax_data.acceleration.max = data.acceleration;
	
	if(minmax_data.pressure.min > data.weather.pressure)
		minmax_data.pressure.min = data.weather.pressure;
	if(minmax_data.pressure.max < data.weather.pressure)
		minmax_data.pressure.max = data.weather.pressure;
	
}


console.log(minmax_data);