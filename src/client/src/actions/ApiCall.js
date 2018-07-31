class Lifecycle {
  constructor({ init, success, fail }) {
    this.init = init;
    this.success = success;
    this.fail = fail;
  }
}
class ApiCall extends Lifecycle {
  constructor(key) {
    super({
      init: `${key}_INIT`,
      success: `${key}_SUCCESS`,
      fail: `${key}_FAIL`
    });
    this.key = key;
  }
  fetch(apiFun) {
    return dispatch => {
      dispatch({
        type: this.init
      });
      return apiFun
        .then(response => {
          dispatch({
            type: this.success,
            payload: response
          });
        })
        .catch(error => {
          dispatch({
            type: this.fail,
            payload: error
          });
        });
    };
  }
}
export { ApiCall };
