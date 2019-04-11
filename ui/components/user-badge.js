// TODO: Tests
//   - Can render with user avatar and name
//   - Renders no image and username when user is null

import React from 'react'

export default ({user}) => {
  return (
    <div className="user-badge">
      <img src={user ? user.avatar : 'err'} />
      <span>{user ? user.name : 'err'}</span>
    </div>
  )
}
