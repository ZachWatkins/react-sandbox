import React from 'react'
import { render, userEvent } from '../utils/test-utils'
import { SessionProvider, useSession } from './SessionContext'
import { describe, expect, it } from 'vitest'
import { PropTypes } from 'prop-types'

describe('SessionProvider', () => {
  const TestComponent = ({ id }) => {
    const { session, dispatchSession } = useSession()
    const countRef = React.useRef(0)
    countRef.current++

    const handleColorChange = (event) => {
      dispatchSession({ type: 'update', payload: { color: event.target.value } })
    }

    return (
      <div id={id} data-renders={countRef.current}>
        <img src="https://placekitten.com/200/300" />
        <a href="https://google.com">
          Google.com
          <a href="https://google.com">Google</a>
        </a>
        <p>Color: {session.color}</p>
        <label htmlFor={`color-input-${id}`}>Choose a color:</label>
        <input type="text" id={`color-input-${id}`} value={session.color} onChange={handleColorChange} />
      </div>
    )
  }
  TestComponent.propTypes = {
    id: PropTypes.string.isRequired,
  }

  it('wraps child components', () => {
    const { container } = render(
      <SessionProvider>
        <TestComponent id="first" />
        <TestComponent id="second" />
      </SessionProvider>,
    )
    const first = container.querySelector('#first')
    const second = container.querySelector('#second')
    expect(first).toBeInTheDocument()
    expect(second).toBeInTheDocument()
  })

  it('only renders child components once', () => {
    const { container } = render(
      <SessionProvider>
        <TestComponent id="first" />
        <TestComponent id="second" />
      </SessionProvider>,
    )
    const first = container.querySelector('#first')
    const second = container.querySelector('#second')
    expect(first.dataset.renders).toEqual('1')
    expect(second.dataset.renders).toEqual('1')
  })

  it('provides default data from the useSession hook to child components', () => {
    const { getByText, getByLabelText, container } = render(
      <SessionProvider>
        <TestComponent id="first" />
        <TestComponent id="second" />
      </SessionProvider>,
    )

    const first = container.querySelector('#first')
    const second = container.querySelector('#second');

    [first, second].forEach(child => {
      const selector = { selector: `#${child.id} *` }
      const colorParagraph = getByText('Color: blue', selector)
      expect(colorParagraph).toBeInTheDocument()
      const colorInput = getByLabelText('Choose a color:', selector)
      expect(colorInput).toBeInTheDocument()
      expect(colorInput.value).toEqual('blue')
    })
  })

  it('allows one child component to update the session data for all child components', async () => {
    const { container } = render(
      <SessionProvider>
        <TestComponent id="first" />
        <TestComponent id="second" />
      </SessionProvider>,
    )

    const first = container.querySelector('#first')
    const second = container.querySelector('#second')

    const subscribers = container.querySelectorAll('input')
    const paragraphs = container.querySelectorAll('p')

    expect(paragraphs[0]).toHaveTextContent('Color: blue')
    expect(paragraphs[1]).toHaveTextContent('Color: blue')

    await userEvent.clear(subscribers[0])
    expect(first.dataset.renders).toEqual('2')
    expect(second.dataset.renders).toEqual('2')
    expect(paragraphs[0]).toHaveTextContent('Color:')
    expect(paragraphs[1]).toHaveTextContent('Color:')
    expect(subscribers[1].value).toEqual('')

    // Typing 3 letters should trigger 3 renders.
    await userEvent.type(subscribers[0], 'red')
    expect(first.dataset.renders).toEqual('5')
    expect(second.dataset.renders).toEqual('5')
    expect(paragraphs[0]).toHaveTextContent('Color: red')
    expect(paragraphs[1]).toHaveTextContent('Color: red')
    expect(subscribers[1].value).toEqual('red')
  })
})
