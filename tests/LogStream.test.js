import React from 'react';
import ReactDOM from 'react-dom';
import LogStream from './LogStream';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LogStream />, div);
});
