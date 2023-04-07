/**
 * A React Context Provider component which manages an object's state.
 */
import React from "react";

const UNINITIALIZED = "Context is uninitialized";
const Value = {
    state: UNINITIALIZED,
    list: [],
};
export const UserContext = React.createContext(Value);

export function Provider(props) {
    const { children, value } = props;
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useValue() {
    const value = React.useContext(UserContext);
    if (value === Value) {
        throw new Error(UNINITIALIZED);
    }
    return value;
}

export default UserContext;
