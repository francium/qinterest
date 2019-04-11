// TODO: Tests
//   - Can render with user avatar and name
//   - Renders no image and username when user is null

import React from 'react'

export default ({user}) => {
  return (
    <div id="user-info">
      <img id="user-avatar" src={user ? user.avatar : ''} />
      <span id="user-name">{user ? user.name : ''}</span>
    </div>
  )
}
