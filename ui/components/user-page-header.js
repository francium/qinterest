import {connect} from 'react-redux'
import React from 'react'

export default ({user}) => (
  <div id="user-page-header">
    <img className="avatar" src={user ? user.avatar : ''} />
    {user && Username(user.name)}
  </div>
)

function Username(name) {
  const pluralization = name.charAt(name.length) === 's' ? "'" : "'s"
  return (
    <div className="username-wrapper">
      <span className="username">{name}</span>
      <span className="username-postfix">{pluralization} pins</span>
    </div>
  )
}
