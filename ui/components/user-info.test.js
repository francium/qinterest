import React from 'react'
import {render, cleanup} from 'react-testing-library'
import UserInfo from './user-info'

const IMG_URL = 'example.com/avatar.jpg'

afterEach(cleanup)

it('can render avatar and username', () => {
  const dom = render(<UserInfo user={{name: 'bob', avatar: IMG_URL}} />)

  const imgEl = dom.container.querySelector('#user-avatar')
  expect(imgEl).toBeDefined()
  expect(imgEl.getAttribute('src')).toBe(IMG_URL)

  const usernameEl = dom.container.querySelector('#user-name')
  expect(usernameEl).toBeDefined()
  expect(dom.getByText('bob')).toBeDefined()
})

it('does not render avatar or username when user is null', () => {
  const dom = render(<UserInfo user={null} />)

  const imgEl = dom.container.querySelector('#user-avatar')
  expect(imgEl).toBeDefined()
  expect(imgEl.getAttribute('src')).toBe('')

  expect(() => dom.getByText('bob')).toThrowError()
})
