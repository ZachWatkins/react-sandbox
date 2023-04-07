import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { UserContext } from '../Components/UserContext';

let container;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

it('Can use the UserContext', () => {
    const TestComponent = () => {
        const value = React.useContext(UserContext);
        return <div>{value}</div>;
    };

    act(() => {
        ReactDOM.render(<TestComponent />, container);
    });

    expect(container.textContent).toBe('Context is uninitialized');

    act(() => {
        ReactDOM.render(<UserContext.Provider value="Hello, world!" />, container);
    });

    expect(container.textContent).toBe('Hello, world!');

    act(() => {
        ReactDOM.render(<TestComponent />, container);
    });

    expect(container.textContent).toBe('Hello, world!');
});
