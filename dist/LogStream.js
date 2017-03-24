'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getFieldValue(event, field) {
  var value = _objectPath2.default.get(event, field.path);
  switch (field.type) {
    case 'time':
      var date = new Date(value);
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
  var newEvent = {
    time: parseInt(event.timeStamp, 10),
    data: JSON.parse(event.data),
    source: event.data
  };
  if (matching && matching.length) {
    var _loop = function _loop(i) {
      var _matching$i = matching[i],
          pattern = _matching$i.pattern,
          bgColorOnMatch = _matching$i.bgColorOnMatch,
          paths = _matching$i.paths;

      var isMatch = false;
      if (paths && paths.length) {
        isMatch = paths.every(function (path) {
          var fieldValue = _objectPath2.default.get(newEvent.data, path);
          return new RegExp(pattern).test(fieldValue);
        });
      } else {
        isMatch = new RegExp(pattern).test(newEvent.source);
      }

      if (isMatch) {
        newEvent.match = {
          bgColorOnMatch: bgColorOnMatch
        };
        return 'break';
      }
    };

    for (var i = 0; i < matching.length; i++) {
      var _ret = _loop(i);

      if (_ret === 'break') break;
    }
  }

  return newEvent;
}

var LogStream = function (_Component) {
  _inherits(LogStream, _Component);

  function LogStream(props) {
    _classCallCheck(this, LogStream);

    var _this = _possibleConstructorReturn(this, (LogStream.__proto__ || Object.getPrototypeOf(LogStream)).call(this, props));

    _this.state = {
      events: [],
      error: null
    };
    return _this;
  }

  _createClass(LogStream, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.source = new EventSource(this.props.url);
      var matching = this.props.config.matching;

      this.source.addEventListener('message', function (e) {
        var newEvent = createEvent(e, matching);
        _this2.setState({
          events: [].concat(_toConsumableArray(_this2.state.events), [newEvent])
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.source.close();
    }
  }, {
    key: 'render',
    value: function render() {
      var mapping = this.props.config.mapping;

      var defaultColumn = '_source';
      var headerRows = [];
      var rows = [];

      if (mapping && mapping.length) {
        headerRows = _react2.default.createElement(
          'tr',
          { className: 'react-log-stream__header-row' },
          mapping.map(function (field) {
            return _react2.default.createElement(
              'th',
              { className: 'react-log-stream__header-row__cell', key: field.label },
              field.label
            );
          })
        );
        rows = this.state.events.map(function (event, index) {
          return _react2.default.createElement(
            'tr',
            {
              style: event.match ? { backgroundColor: event.match.bgColorOnMatch } : {},
              className: "react-log-stream__row " + (index % 2 === 0 ? 'react-log-stream__row--even' : 'react-log-stream__row--odd'),
              key: event.time
            },
            mapping.map(function (field) {
              return _react2.default.createElement(
                'td',
                { className: 'react-log-stream__row__cell', key: field.label },
                getFieldValue(event.data, field)
              );
            })
          );
        });
      } else {
        headerRows = _react2.default.createElement(
          'tr',
          { className: 'react-log-stream__header-row' },
          _react2.default.createElement(
            'th',
            { className: 'react-log-stream__header-row__cell' },
            defaultColumn
          )
        );
        rows = this.state.events.map(function (event, index) {
          return _react2.default.createElement(
            'tr',
            {
              style: event.match ? { backgroundColor: event.match.bgColorOnMatch } : {},
              className: "react-log-stream__row " + (index % 2 === 0 ? 'react-log-stream__row--even' : 'react-log-stream__row--odd'),
              key: event.time
            },
            _react2.default.createElement(
              'td',
              { className: 'react-log-stream__row__cell' },
              event.source
            )
          );
        });
      }
      return _react2.default.createElement(
        'table',
        { className: 'react-log-stream' },
        _react2.default.createElement(
          'thead',
          null,
          rows.length ? headerRows : null
        ),
        _react2.default.createElement(
          'tbody',
          null,
          rows
        )
      );
    }
  }]);

  return LogStream;
}(_react.Component);

LogStream.propTypes = {
  /**
   * The url for fetching events
   */
  url: _react.PropTypes.string.isRequired,

  /**
   * Object with mapping event fields to table
   */
  config: _react.PropTypes.object
};
LogStream.defaultProps = {
  config: {}
};
exports.default = LogStream;