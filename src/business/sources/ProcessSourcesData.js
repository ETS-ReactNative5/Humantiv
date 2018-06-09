import axios from 'axios';
import moment from 'moment';
import {convertMinutesToHours} from '../Helpers';
import convert from 'convert-units';

const MAX_SERIES_NUMBER = 15;

export const getActivityTimeSeries = (access_token) => {
  const url = `https://api.humanapi.co/v1/human/activities/summaries?access_token=${access_token}`

  return new Promise( (resolve, reject) => {
    axios({
      method:'get',
      url:url,
      responseType:'json'
    })
    .done(function(response) {
      let val = [];
      response.data.map( (item, index) => {
        if (index< MAX_SERIES_NUMBER) {
          let time_series = {
            time: moment(item.date, "YYYY-MM-DD").unix(),
            value: item.steps
          }
          val.push(time_series);
        }
      })
      resolve(val);

      console.log(response.data);
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
  })
}

export const getSleepTimeSeries = (access_token) => {
  const url = `https://api.humanapi.co/v1/human/sleeps/summaries?access_token=${access_token}`

  return new Promise( (resolve, reject) => {
    axios({
      method:'get',
      url:url,
      responseType:'json'
    })
    .done(function(response) {
      let val = [];
      response.data.map( (item, index) => {
        if (index< MAX_SERIES_NUMBER) {
          let time_series = {
            time: moment(item.date, "YYYY-MM-DD").unix(),
            value: convertMinutesToHours(item.timeAsleep)
          }
          val.push(time_series);
        }
      })
      resolve(val);

      console.log(response.data);
    });
  })
}

export const getHeartrateTimeSeries = (access_token) => {
  const url = `https://api.humanapi.co/v1/human/heart_rate/summaries?access_token=${access_token}`

  return new Promise( (resolve, reject) => {
    axios({
      method:'get',
      url:url,
      responseType:'json'
    })
    .done(function(response) {
      let val = [];
      response.data.map( (item, index) => {
        if (index< MAX_SERIES_NUMBER) {
          let time_series = {
            time: moment(item.date, "YYYY-MM-DD").unix(),
            value: item.restingHR
          }
          val.push(time_series);
        }
      })
      resolve(val);

      console.log(response.data);
    });
  })
}

export const getWeightTimeSeries = (access_token) => {
  const url = `https://api.humanapi.co/v1/human/weight/readings?access_token=${access_token}`

  return new Promise( (resolve, reject) => {
    axios({
      method:'get',
      url:url,
      responseType:'json'
    })
    .done(function(response) {
      let val = [];
      response.data.map( (item, index) => {
        if (index< MAX_SERIES_NUMBER) {
          let weight = item.value;
          if ( item.unit === 'kg') {
            weight = parseFloat(convert(weight).from('kg').to('lb').toFixed(2));
          }
          let time_series = {
            time: moment(item.date, "YYYY-MM-DD").unix(),
            value: weight
          }
          val.push(time_series);
        }
      })
      resolve(val);

      console.log(response.data);
    });
  })
}