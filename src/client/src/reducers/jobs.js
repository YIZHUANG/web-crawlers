import { fetchJobsAction, webCrawlingAction } from '../actions';

const INITIAL_STATE = {
  isFetchingInProgress: undefined,
  isFetchingCompleted: undefined,
  hasFailed: undefined,
  webCrawlingInProgress: undefined,
  webCrawlingCompleted: undefined,
  jobs: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case fetchJobsAction.init:
      return { isFetchingInProgress: true };
    case fetchJobsAction.success:
      return {
        isFetchingInProgress: false,
        isFetchingCompleted: true,
        jobs: action.payload.data
      };
    case fetchJobsAction.fail:
      return { hasFailed: true };
    case webCrawlingAction.init:
      return {
        webCrawlingCompleted: false,
        webCrawlingInProgress: true,
        ...state
      };
    case webCrawlingAction.success:
      return {
        webCrawlingCompleted: true,
        isFetchingCompleted: true,
        jobs: action.payload.data
      };
    case webCrawlingAction.fail:
      return {
        webCrawlingInProgress: false,
        webCrawlingCompleted: false,
        hasFailed: true,
        ...state
      };
    default:
      return state;
  }
};
