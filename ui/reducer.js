// TODO Test
//   - INIT: set pins, user, pageUser and error based on payload
//   - FETCH_MORE_PINS_SUCCESS: sets loadingPins to false, and sets pins and
//       morePinsAvailable based on payload
//   - FETCH_MORE_PINS_IN_PROGRESS: sets loadingPins to true
//   - ADD_PIN: Updates stats pins with new pin
//   - DELETE_PIN: Removes deleted pin from state pins

import {PIN_REQUEST_COUNT} from './consts'
import {
  INIT,
  FETCH_MORE_PINS,
  FETCH_MORE_PINS_IN_PROGRESS,
  FETCH_MORE_PINS_SUCCESS,
  ADD_PIN,
  DELETE_PIN,
} from './actions'

const initialState = {
  pins: [],
  user: null,
  pageUser: null, // user's page data
  loadingPins: false,
  error: null,
  morePinsAvailable: true,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INIT:
      return {
        ...state,
        pins: initialData.pins,
        user: initialData.user,
        pageUser: initialData.pageUser,
        error: initialData.error,
      }

    case FETCH_MORE_PINS:
      return state

    case FETCH_MORE_PINS_SUCCESS:
      const allPins = [...state.pins, ...action.payload.pins]
      // drop last which is only needed for checking if more pins are available
      allPins.pop()

      return {
        ...state,
        pins: allPins,
        loadingPins: false,
        morePinsAvailable: action.payload.pins.length === PIN_REQUEST_COUNT + 1,
      }

    case FETCH_MORE_PINS_IN_PROGRESS:
      return {
        ...state,
        loadingPins: true,
      }

    case ADD_PIN:
      const newPin = {...action.payload.pin}
      return {
        ...state,
        pins: [newPin, ...state.pins]
      }

    case DELETE_PIN:
      return {
        ...state,
        pins: state.pins.filter(pin => pin.id !== action.payload.id),
      }

    default:
      return state
  }
}
