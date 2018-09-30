import axios from 'axios';
import { ApiCall } from './ApiCall';

const FETCH_JOBS = 'FETCH_JOBS';
const WEB_CRAWLING = 'WEB_CRAWLING';

const webCrawlingAction = new ApiCall(WEB_CRAWLING);
const webCrawlingRequest = keywords =>
  axios.post('/api/startCrawling', keywords);

const fetchJobsAction = new ApiCall(FETCH_JOBS);
const fetchJobsRequest = axios.get('/api/readFiles');

export const fetchJobs = fetchJobsAction.fetch.bind(
  fetchJobsAction,
  fetchJobsRequest
);

export const startWebCrawling = keywords =>
  webCrawlingAction.fetch(webCrawlingRequest(keywords));

export { fetchJobsAction, webCrawlingAction };
