#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));

const helptxt = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`;

if (args.h){
    console.log(helptxt);
    process.exit(0);
}

const lat = args.n || args.s * -1;
const long = args.e || args.w * -1;
const timezone = args.z || moment.tz.guess() ;
// var days;

// //console.log(args.d)

// if (typeof args.d === undefined) {
//     days = args.d; 
// } else {
//     days = 1;
// }

var days = typeof args.d === undefined ? 1 : args.d

//console.log(days)
var rainOrNot;

const url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&timezone=" + timezone + "&daily=precipitation_hours";
const response = await fetch(url);
const data = await response.json();

if(args.j) {
    console.log(data);
    process.exit(0);
}

if(data.daily.precipitation_hours[days] > 0) {
    rainOrNot = "You might need your galoshes ";
} else {
    rainOrNot = "You will not need your galoshes ";
}
    
if (days == 0) {
    console.log(rainOrNot + "today.");
} else if (days > 1) {
    console.log(rainOrNot + "in " + days + " days.");
} else {
    console.log(rainOrNot + "tomorrow.");
}  
process.exit(0);
