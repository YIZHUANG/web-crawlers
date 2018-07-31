import axios from 'axios';
import { ApiCall } from './ApiCall';

const FETCH_JOBS = 'FETCH_JOBS';
const WEB_CRAWLING = 'WEB_CRAWLING';
const WEB_CRAWLING_INIT = 'WEB_CRAWLING_INIT';
const WEB_CRAWLING_SUCCESS = 'WEB_CRAWLING_SUCCESS';
const WEB_CRAWLING_FAIL = 'WEB_CRAWLING_FAIL';

export const startWebCrawling = keywords => {
  return dispatch => {
    dispatch({
      type: WEB_CRAWLING_INIT
    });
    axios
      .post('/api/startCrawling', keywords)
      .then(res =>
        dispatch({
          type: WEB_CRAWLING_SUCCESS,
          payload: res
        })
      )
      .catch(error =>
        dispatch({
          type: WEB_CRAWLING_FAIL
        })
      );
  };
};

const webCrawlingAction = new ApiCall(WEB_CRAWLING);
const fetchJobsAction = new ApiCall(FETCH_JOBS);
const fetchJobsRequest = axios.get('/api/readFiles');

export const fetchJobs = fetchJobsAction.fetch.bind(
  fetchJobsAction,
  fetchJobsRequest
);
export { fetchJobsAction, webCrawlingAction };
