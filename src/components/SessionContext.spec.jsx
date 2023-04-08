import React from 'react';
import { render, screen, userEvent } from '../utils/test-utils';
import { SessionProvider, useSession } from "./SessionContext";
import { describe, assert, expect, test, it, bench } from 'vitest';

describe("SessionContext", () => {
    it("renders a component that uses the useSession hook.", async () => {
        const TestComponent = () => {
            const { session, dispatchSession } = useSession();

            const handleColorChange = (event) => {
                dispatchSession({ type: "update", payload: { ...session, color: event.target.value } });
            };

            return (
                <div>
                    <p>Color: {session.color}</p>
                    <label htmlFor="color-input">Choose a color:</label>
                    <input type="text" id="color-input" value={session.color} onChange={handleColorChange} />
                </div>
            );
        };

        const { getByText, getByLabelText } = render(
            <SessionProvider>
                <TestComponent />
            </SessionProvider>
        );

        const colorParagraph = getByText("Color: blue");
        const colorInput = getByLabelText("Choose a color:");

        expect(colorParagraph).toBeInTheDocument();
        await userEvent.clear(colorInput);
        await userEvent.type(colorInput, "red");
        expect(colorParagraph).toHaveTextContent("Color: red");
    });
});
