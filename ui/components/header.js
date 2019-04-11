// TODO: Teets
//   - can display logo and wormark with link to /
//   - can display login/logout/username-badge when no error
//   - does not display login/logout/username-badge when error
//   - displays login button when user is not logged in
//   - displays logout button when user is logged in
//   - displays user-badge when user is logged in with link to /user/username

import {connect} from 'react-redux'
import React from 'react'
import Appbar from 'muicss/lib/react/appbar'
import Button from 'muicss/lib/react/button'

import UserBadge from './user-badge'

function login() {
  window.location.pathname = '/login'
}

function logout() {
  window.location.pathname = '/logout'
}

function gotoUserPage(user) {
  if (user) {
    window.location.pathname = '/user/' + user.name
  }
}

const Header = ({user, error}) => (
  <Appbar id="header">
    <a id="header-logo" className="mui-appbar-height" href="/">
      <img src="/static/logo.png" />
      <span className="wordmark">
        <b>q</b>interest
      </span>
    </a>

    {error == null && (
      <div id="login-logout-username">
        {user == null ? (
          <Button color="danger" onClick={() => login()}>
            Login with Github
          </Button>
        ) : (
          <a className="username" href={`/user/${user.name}`}>
            <UserBadge user={user} />
          </a>
        )}
        {user != null && (
          <Button color="danger" onClick={() => logout()}>
            Logout
          </Button>
        )}
      </div>
    )}
  </Appbar>
)

const mapStateToProps = state => ({
  user: state.user,
  error: state.error,
})

export default connect(
  mapStateToProps,
  {},
)(Header)
