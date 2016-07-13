import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchTables, openTable } from '../actions'

function mapStateToProps(state) {
  return {
    tableNames: state.tableNames,
    activeTableName: state.activeTableName
  }
}

export default class Tables extends Component {
  
  componentDidMount() {
    this.props.dispatch(fetchTables());
  }
  
  openTable(tableName, evt) {
    this.props.dispatch(openTable(tableName));
  }
  
  render() {
    let tables = this.props.tableNames.map(tableName => {
      let isActive = tableName == this.props.activeTableName;
      return (
        <a key={tableName} href="#" 
          className={isActive ? "list-group-item active" : "list-group-item"}
          onClick={this.openTable.bind(this, tableName)}>{tableName}</a>
      )
    });
    
    return (
      <ul className="list-group">
        {tables}
      </ul>
    );
  }

}

export default connect(mapStateToProps)(Tables);
