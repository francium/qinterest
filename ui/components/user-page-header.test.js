import React from 'react'
import {render, cleanup} from 'react-testing-library'
import UserPageHeader from './user-page-header'

const IMG_URL = 'example.com/avatar.jpg'

afterEach(cleanup)

it('can render avatar and username', () => {
  const dom = render(<UserPageHeader user={{name: 'bob', avatar: IMG_URL}} />)

  const imgEl = dom.container.querySelector('.avatar')
  expect(imgEl).toBeDefined()
  expect(imgEl.getAttribute('src')).toBe(IMG_URL)

  expect(dom.getByText('bob')).toBeDefined()
  expect(dom.getByText("'s pins")).toBeDefined()
})

it('renders nothing when user is null', () => {
  const dom = render(<UserPageHeader user={null} />)

  const imgEl = dom.container.querySelector('.avatar')
  expect(imgEl).toBeDefined()
  expect(imgEl.getAttribute('src')).toBe('')

  expect(() => dom.getByText('bob')).toThrowError()
  expect(() => dom.getByText("'s pins")).toThrowError()
})
