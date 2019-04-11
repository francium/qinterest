// TODO Test
//   - init: returns type INIT
//   - fetMorePins:
//     - calls fetchMoreInProgress
//     - fetches '/api/pin' with params {offset, limit} (no username)
//     - fetches '/api/pin' with params {offset, limit, username} (with username)
//     - calls fetchMorePinSuccess when fetch succeeds
//   - fetchMoreInProgress: returns type FETCH_MORE_PINS_IN_PROGRESS
//   - fetchMorePinSuccess: returns type FETCH_MORE_PINS_SUCCESS with payload containing
//       pins
//   - addPin:
//     - posts to '/api/pin' with payload containing url
//     - dispatches action with type ADD_PIN and payload containing new pin response on
//         successful API call
//   - deletePin:
//      - deletes to '/api/pin' with query param containing id
//      - dispatches action with type DELETE_PIN and payload containing id when API calls
//          successful

import {PIN_REQUEST_COUNT} from './consts'

export const INIT = 'INIT'
export const FETCH_MORE_PINS = 'FETCH_MORE_PINS'
export const FETCH_MORE_PINS_IN_PROGRESS = 'FETCH_MORE_PINS_IN_PROGRESS'
export const FETCH_MORE_PINS_SUCCESS = 'FETCH_MORE_PINS_SUCCESS'
export const ADD_PIN = 'ADD_PIN'
export const DELETE_PIN = 'DELETE_PIN'

export const init = () => ({
  type: INIT,
})

export const fetchMorePins = (currentNumberOfPins, username=undefined) => {
  return dispatch => {
    dispatch(fetchMoreInProgress())

    const params = {offset: currentNumberOfPins, limit: PIN_REQUEST_COUNT + 1}
    if (username) params.username = username

    const url = new URL(
      `${window.location.protocol}//${window.location.href.split('/')[2]}/api/pin`)
    url.search = new URLSearchParams(params)

    fetch(url).then(resp => resp.json()).then(pins => {
      dispatch(fetchMorePinSuccess(pins))
    })
  }
}

export const fetchMoreInProgress = () => {
  return {
    type: FETCH_MORE_PINS_IN_PROGRESS,
  }
}

export const fetchMorePinSuccess = (pins) => ({
  type: FETCH_MORE_PINS_SUCCESS,
  payload: {
    pins,
  }
})

export const addPin = (url) => {
  return dispatch => {
    fetch('/api/pin', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({url}),
    }).then(resp =>
      resp.json()
    ).then(json => {
      dispatch({
        type: ADD_PIN,
        payload: {
          pin: json,
        }
      })
    })
  }
}

export const deletePin = (id) => {
    const url = new URL(
      `${window.location.protocol}//${window.location.href.split('/')[2]}/api/pin`)
    url.search = new URLSearchParams({id})
  fetch(url, {
    method: 'DELETE',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
  })
  return {
    type: DELETE_PIN,
    payload: {
      id,
    }
  }
}
