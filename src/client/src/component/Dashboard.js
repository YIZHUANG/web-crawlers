import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchJobs, startWebCrawling } from '../actions';
import LoaderContainer from './LoaderContainer';
import JobTable from './tableContainer';
import FilterBox from './filterBox';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      excludeWords: [
        'junior',
        'senior',
        'java',
        'cloud',
        'architect',
        'security',
        'game',
        'php',
        'drupal',
        '.net',
        'C#',
        'email',
        'specialist',
        'lead',
        'designer',
        'linux',
        'android',
        'trainee',
        'intern',
        'ios',
        'automation',
        'expert',
        'python'
      ],
      includeWords: [
        'react',
        'javascript',
        'softwaredeveloper',
        'software',
        'web',
        'developer',
        'full-stack',
        'front-end',
        'softwareenginner'
      ],
      excludeInput: '',
      includeInput: ''
    };
  }
  componentDidMount() {
    const { jobState, fetchJobs } = this.props;
    const isFetchingCompleted = jobState.isFetchingCompleted;
    if (!isFetchingCompleted) {
      fetchJobs();
    }
  }

  componentWillReceiveProps({ jobState, fetchJobs }) {
    const { isFetchingCompleted, webCrawlingInProgress, hasFailed } = jobState;
    const currentIsFetchingInProgress = this.props.jobState
      .isFetchingInProgress;
    const currentWebCrawlingInProgress = this.props.jobState
      .webCrawlingInProgress;
    if (currentWebCrawlingInProgress && !webCrawlingInProgress) {
      toast.success('Web crawling has succssed !', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
    if (currentIsFetchingInProgress && !isFetchingCompleted) {
      fetchJobs();
    }
    if (hasFailed) {
      toast.error('Web crawling has failed due to bad network connection!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000
      });
    }
  }

  render() {
    const { jobState } = this.props;
    const {
      isFetchingInProgress,
      isFetchingCompleted,
      webCrawlingInProgress
    } = jobState;
    if (isFetchingInProgress || !isFetchingCompleted) {
      return (
        <LoaderContainer>
          <Loader type="Circles" height={80} width={80} />
        </LoaderContainer>
      );
    }
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className="jobs_container">
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <FilterBox
                words={this.state.excludeWords}
                title="Exclude search"
                onSubmit={e => {
                  e.preventDefault();
                  this.setState((prevState, props) => ({
                    excludeWords: [
                      this.state.excludeInput.replace(/\s/g, '').toLowerCase(),
                      ...prevState.excludeWords
                    ],
                    excludeInput: ''
                  }));
                }}
                onClick={position => {
                  this.setState((prevState, props) => ({
                    excludeWords: prevState.excludeWords.filter(
                      (ele, index) => index !== position
                    )
                  }));
                }}
                value={this.state.excludeInput}
                onChange={e => this.setState({ excludeInput: e.target.value })}
              />
              <FilterBox
                words={this.state.includeWords}
                title="Include search"
                onSubmit={e => {
                  e.preventDefault();
                  this.setState((prevState, props) => ({
                    includeWords: [
                      this.state.includeInput.replace(/\s/g, '').toLowerCase(),
                      ...prevState.includeWords
                    ],
                    includeInput: ''
                  }));
                }}
                onClick={position => {
                  this.setState((prevState, props) => ({
                    includeWords: prevState.includeWords.filter(
                      (ele, index) => index !== position
                    )
                  }));
                }}
                value={this.state.includeInput}
                onChange={e => this.setState({ includeInput: e.target.value })}
              />
            </div>
            <button
              disabled={webCrawlingInProgress}
              className="button__container"
              onClick={() =>
                this.props.startWebCrawling({
                  includeWords: this.state.includeWords,
                  excludeWords: this.state.excludeWords
                })
              }
            >
              Start web crawling to get the latest job info
            </button>
            {webCrawlingInProgress && (
              <LoaderContainer>
                <span>Web crawling is in progress,might take a min</span>
                <Loader
                  type="ThreeDots"
                  color="#somecolor"
                  height={80}
                  width={80}
                />
              </LoaderContainer>
            )}
            <JobTable
              loading={webCrawlingInProgress}
              jobs={jobState.jobs || []}
            />
          </div>
        </div>
        <ToastContainer autoClose={8000} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    jobState: state.jobReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchJobs: () => {
      dispatch(fetchJobs());
    },
    startWebCrawling: keywords => {
      dispatch(startWebCrawling(keywords));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
