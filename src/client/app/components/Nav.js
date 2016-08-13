import React from 'react';
import { connect } from 'react-redux';

import { fetchMetadata } from '../actions';

function mapStateToProps(state) {
  return {
    'metadata': state.metadata
  }
}

class Nav extends React.Component {

  componentDidMount() {
    this.props.dispatch(fetchMetadata());
  }

  render() {
    return (
      <nav className="navbar navbar-dark navbar-fixed-top bg-inverse">
        <a className="navbar-brand" href="#">DynamoDB Web</a>
        <div id="navbar">
          <nav className="nav navbar-nav pull-xs-left">
            <span className="nav-item nav-link">{this.props.metadata.endpoint}</span>
          </nav>
          <nav className="nav navbar-nav pull-xs-right">
            <a className="nav-item nav-link" target="_blank" href="https://github.com/garrettheel/dynamoweb">Github</a>
          </nav>
        </div>
      </nav>
    )
  }

}

export default connect(mapStateToProps)(Nav);
