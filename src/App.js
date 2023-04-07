import React from "react";
import { hot } from 'react-hot-loader/root';

export function App (props) {
  const { name } = props;
  return (
    <div>
      <h1>
        Helloo {name}
      </h1>
    </div>
  );
}

export default hot(App);
