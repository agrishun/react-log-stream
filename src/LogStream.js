import React, { Component, PropTypes } from 'react';
import objectPath from 'object-path';


function getFieldValue(event, field) {
  const value = objectPath.get(event, field.path);
  switch (field.type) {
    case 'time':
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      } else {
        return date.toUTCString();
      }
    default:
      return value;
  }
}

function createEvent(event, matching) {
  const newEvent = {
    time: parseInt(event.timeStamp, 10),
    data: JSON.parse(event.data),
    source: event.data
  }
  if (matching && matching.length) {
    for (let i = 0; i < matching.length; i++){
      let {
        pattern,
        bgColorOnMatch,
        paths
      } = matching[i];
      let isMatch = false;
      if (paths && paths.length) {
        isMatch = paths.every(path => {
          const fieldValue = objectPath.get(newEvent.data, path);
          return new RegExp(pattern).test(fieldValue);
        });
      } else {
        isMatch = new RegExp(pattern).test(newEvent.source);
      }

      if (isMatch) {
          newEvent.match = {
            bgColorOnMatch
          }
          break;
      }
    }
  }

  return newEvent;
}

class LogStream extends Component {
  static propTypes = {
    /**
     * The url for fetching events
     */
    url: PropTypes.string.isRequired,

    /**
     * Object with mapping event fields to table
     */
    config: PropTypes.object,
  }

  static defaultProps = {
    config: {}
  };

  constructor(props) {
    super(props)
    this.state = {
      events: [],
      error: null
    }
  }
  componentWillMount() {
    this.source = new EventSource(this.props.url);
    const { matching } = this.props.config;
    this.source.addEventListener('message', e => {
      const newEvent = createEvent(e, matching);
      this.setState({
        events: [...this.state.events, newEvent]
      });
    });
  }
  componentWillUnmount() {
    this.source.close()
  }
  render() {
    const { mapping } = this.props.config;
    const defaultColumn = '_source';
    let headerRows = [];
    let rows = [];

    if (mapping && mapping.length) {
      headerRows = (
        <tr className="react-log-stream__header-row">
          {mapping.map(field => (
            <th className="react-log-stream__header-row__cell" key={field.label}>{field.label}</th>
          ))}
        </tr>
      )
      rows = (
        this.state.events.map((event, index) => (
          <tr
            style={(event.match) ? {backgroundColor: event.match.bgColorOnMatch} : {}}
            className={"react-log-stream__row " + (index % 2 === 0 ? 'react-log-stream__row--even' : 'react-log-stream__row--odd')}
            key={event.time}
          >
            {mapping.map(field => (
              <td className="react-log-stream__row__cell" key={field.label}>{getFieldValue(event.data, field)}</td>
            ))}
          </tr>
        ))
      )
    } else {
      headerRows = (
        <tr className="react-log-stream__header-row">
          <th className="react-log-stream__header-row__cell">{defaultColumn}</th>
        </tr>
      )
      rows = (
        this.state.events.map((event, index) => (
          <tr
            style={(event.match) ? {backgroundColor: event.match.bgColorOnMatch} : {}}
            className={"react-log-stream__row " + (index % 2 === 0 ? 'react-log-stream__row--even' : 'react-log-stream__row--odd')}
            key={event.time}
          >
            <td className="react-log-stream__row__cell">{event.source}</td>
          </tr>
        ))
      )
    }
    return (
      <table className="react-log-stream">
        <thead>
          {rows.length ? headerRows : null}
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

export default LogStream;
