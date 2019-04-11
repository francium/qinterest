// TODO: Test
//   - Displays header and error only when error is not null
//   - Displays header and gallery when no error and not on a user page
//   - Displays header and user page header and gallery when on user page
//   - Does not do anything when scrolling to bottom and morePinsAvailable is true
//   - Does not do anything when scrolling to bottom and loadingPins is true
//   - calls fetchMorePins when scroll to bottom and morePinsAvailable is false and
//       loadingPins is false

import React from 'react'
import {connect} from 'react-redux'

import Gallery from './gallery'
import NewPin from './new-pin'
import Header from './header'
import UserPageHeader from './user-page-header'

import {init as initAction, fetchMorePins} from '../actions'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scroll: document.documentElement.scrollTop,
    }
  }

  componentDidMount() {
    this.props.initAction()
    window.addEventListener(
      'scroll',
      event => {
        if (!this.props.morePinsAvailable || this.props.loadingPins) {
          return
        }

        const scrolled = document.documentElement.scrollTop
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight

        const isNearEnd = height - scrolled < 1000

        const hrefSegments = window.location.href.split('/')
        const userPage = window.location.href.includes('/user/')
          ? hrefSegments[hrefSegments.length - 1]
          : undefined

        if (isNearEnd && this.state.scroll < scrolled) {
          this.props.fetchMorePins(this.props.pins.length, userPage)
        }

        this.setState({scroll: scrolled})
      },
      {passive: true},
    )
  }

  render() {
    const isUserPage = window.location.href.includes('/user/')
    return (
      <div id="app">
        <Header />

        {this.props.error != null && (
          <h1 id="error-banner">{formatError(this.props.error)}</h1>
        )}

        {this.props.error == null && (
          <>
            {isUserPage && <UserPageHeader user={this.props.pageUser} />}
            {!isUserPage && this.props.user && <NewPin />}
            <Gallery pins={this.props.pins} />
          </>
        )}
      </div>
    )
  }
}

const mappStateToProps = state => ({
  pins: state.pins,
  user: state.user,
  pageUser: state.pageUser,
  error: state.error,
  morePinsAvailable: state.morePinsAvailable,
  loadingPins: state.loadingPins,
})

export default connect(
  mappStateToProps,
  {initAction, fetchMorePins},
)(App)

function formatError(error) {
  const message = {
    '404': "Sorry, we can't find that page.",
    '500': 'Something went wrong on our end. Try refreshing the page.',
  }[error.toString()]

  return <div>{message}</div>
}
