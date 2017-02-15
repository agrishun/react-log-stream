
## Overview
A simple React component that renders server-side events with configurable layout and pattern matching

Some notable features:

- Simplicity. `react-log-stream` requires only a url with server-side events.
- Configurable. The component accepts a configuration object that can specify table layout mapping and pattern matching for fields highlighting.
- Customization. `react-log-stream` has a default table layout without any styles. It uses BEM notation for CSS classes, so additional styles could be applied by using those classnames.

## Installation
    npm install react-log-stream --save

## Usage

```javascript
import LogStream from 'react-log-stream';

const SERVER_SENT_EVENTS_URL = 'http://...';
const config = {
  mapping: [
    {
      type: "str",
      path: "label",
      label: "Some custom name"
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

<LogStream
  url={SERVER_SENT_EVENTS_URL}
  config={config}
/>
```

## Configuration

Config property accepts an object with two optional properties, `mapping` and `matching`.

#### Mapping

Allows to displays only specific event fields with custom column headers.

If it's empty, only one column `_source` will be displayed, containing the whole json data as a string.

```js
Array<Object>
{
  type: "str",
  path: "label",
  label: "Some custom name"
}
```

**type** - Type of the property value. Possible values are `time`, `str`, and `int`.

**path** - Full path to the object property. Accepts dot notation, `object.someProp.anotherProp`.

**label** - Text label for column header.


#### Matching

Allows to specify pattern, properties that need to match the pattern and background color for row in case of full match.

This option is useful if certain type of events has to be highlighted.

```js
Array<Object>
{
  bgColorOnMatch: 'red',
  pattern: '[GS]',
  paths: [
    'label'
  ]
}
```

**bgColorOnMatch** - CSS color for highlighting selected row.

**pattern** - Regular expression pattern to match the property and highlight the row.

**paths** - An array of event properties that need to match pattern. Matching works only if all specified properties match the pattern.

## Customization

The component has the following html structure with BEM classes

```html
<table className="react-log-stream">
  <thead>
    <tr className="react-log-stream__header-row">
      <th className="react-log-stream__header-row__cell"></th>
    </tr>
  </thead>
  <tbody>
    <tr className="react-log-stream__row">
      <td className="react-log-stream__row__cell"></td>
    </tr>
  </tbody>
</table>
```

Addtionally rows have classes
```css
.react-log-stream__row--even
.react-log-stream__row--odd
```

## Development
    npm install
    npm start

## License
  MIT
