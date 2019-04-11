// TODO: Tests
//   - Renders button with '+'
//   - Renders button with '>' and input after initial click on button
//   - Focuses input when opened
//   - Closes on second click on button if input empty and hides input and shows '+'
//   - Resets input value to '' after close or submission
//   - Calls action when input is not empty and user clicks button
//   - Closes when open and user click background layer

import {connect} from 'react-redux'
import React from 'react'
import Button from 'muicss/lib/react/button'

import {addPin} from '../actions'

class NewPin extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      open: false,
      url: '',
    }
  }

  onClick() {
    if (this.state.open && this.state.url.length > 0) {
      this.props.addPin(this.state.url)
      this.setState({url: ''})
    }

    if (!this.state.open) {
      setTimeout(
        () => this.inputRef.current.querySelector('input').focus(),
        250,
      )
    }

    this.setState({open: !this.state.open})
  }

  onCancel() {
    this.setState({open: false, url: ''})
  }

  onInput(ev) {
    this.setState({url: ev.target.value})
  }

  render() {
    return (
      <div>
        {this.state.open && (
          <div id="new-pin-cancel" onClick={() => this.onCancel()} />
        )}
        <div id="new-pin" ref={this.inputRef}>
          {this.state.open && (
            <input placeholder="Image URL" onInput={ev => this.onInput(ev)} />
          )}
          <Button variant="fab" color="danger" onClick={() => this.onClick()}>
            {this.state.open ? '>' : '+'}
          </Button>
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  {addPin},
)(NewPin)
