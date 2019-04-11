// TODO: Test
//   - Displays pins and does not display loading message when loading false
//   - Does not display pins when no pins provided (empty array)
//   - Each pin has a unique key attribute
//   - Displays loading message when loading is true
//   -

import {connect} from 'react-redux'
import React from 'react'

import Pin from './pin'
import UserInfo from './user-info'

const Gallery = ({loggedInUser, pins, loadingPins}) => {
  return (
    <div id="gallery">
      <div id="pins-wrapper">
        {pins.map(pin => (
          <Pin key={pin.id} pin={pin} />
        ))}
      </div>
      {loadingPins && <div className="gallery-loading">Loading</div>}
    </div>
  )
}

const mapStateToProps = state => ({
  loadingPins: state.loadingPins,
})

export default connect(
  mapStateToProps,
  {},
)(Gallery)
