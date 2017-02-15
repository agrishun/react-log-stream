import React from 'react';
import ReactDOM from 'react-dom';
import LogStream from '../src';

const config = {
  mapping: [
    {
      type: "time",
      path: "timestamp",
      label: "Time"
    },
    {
      type: "str",
      path: "label",
      label: "Some custom name"
    },
    {
      type: "int",
      path: "x",
      label: "X coordinate"
    }
  ],
  matching: [
    {
      bgColorOnMatch: 'red',
      pattern: '[GS]',
      paths: [
        'label'
      ]
    }
  ]
}

ReactDOM.render(
  <LogStream
    streamUrl="https://sse-dashboard.herokuapp.com/"
    config={config}
  />,
  document.getElementById('root')
);
