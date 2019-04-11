// TODO: Tests
//   - Can render image and user info (name and author)
//   - Can click to enlarge (css class appended)
//   - Can click when elarged to shirnk (css class removed)
//   - Is assigned a background color
//   - Can display delete button when author is currently logged in user
//   - Displays link with short-url

import {connect} from 'react-redux'
import React from 'react'
import {default as cx} from 'classnames'

import UserBadge from './user-badge'
import {deletePin} from '../actions'

const COLORS = [
  '#1f3c88',
  '#5893d4',
  '#f7b633',
  '#bd512f',
  '#acc6aa',
  '#71a0a5',
  '#77628c',
  '#f36a7b',
  '#a3816a',
  '#fdc57b',
  '#007880',
  '#bd245f',
  '#ff8b6a',
  '#efca8c',
  '#e4508f',
]

class Pin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      enlarge: false,
    }
  }

  toggleEnlarge() {
    this.setState({enlarge: !this.state.enlarge})
  }

  render() {
    const style = {
      background: mapUrlToColor(this.props.pin.url),
    }

    return (
      <div className="pin">
        <img
          className={cx('pin-image', {'pin-enlarge': this.state.enlarge})}
          style={style}
          src={this.props.pin.url}
          onClick={() => this.toggleEnlarge()}
        />

        <PinHeader pin={this.props.pin} />

        <PinInfo
          pin={this.props.pin}
          user={this.props.user}
          deletePin={this.props.deletePin}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
})

export default connect(
  mapStateToProps,
  {deletePin},
)(Pin)

const PinHeader = ({pin}) => (
  <div className="pin-header pin-url">
    <a href={formatShortLink(pin.short)}>link: {formatShortLink(pin.short)}</a>
  </div>
)

const PinInfo = ({pin, user, deletePin}) => (
  <div className="pin-info">
    {user && user.name == pin.username && (
      <button className="delete-pin" onClick={() => deletePin(pin.id)}>
        delete
      </button>
    )}
    <a className="pin-author" href={`/user/${pin.username}`}>
      <UserBadge user={{avatar: pin.user_avatar, name: pin.username}} />
    </a>
  </div>
)

function gotoUserPage(id) {
  window.location.pathname = '/user/' + id
}

function formatShortLink(short) {
  const protocol = window.location.protocol
  const hostname = window.location.href.split('/')[2]
  return `${protocol}//${hostname}/s/${short}`
}

function mapUrlToColor(url) {
  let hash = 0
  for (const ch of url) {
    hash += ch.charCodeAt(0)
  }

  hash %= COLORS.length
  return COLORS[hash]
}
