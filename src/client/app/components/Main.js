import React from 'react';
import { connect } from 'react-redux';

import Nav from './Nav';
import Tables from './Tables';
import TableContainer from './TableContainer'

function mapStateToProps(state) {
  return {
    activeTable: state.tables[state.activeTableName]
  }
}

class Main extends React.Component {

  render() {
    let activeTable = this.props.activeTable;

    let tableContainer = null;
    if (activeTable) {
      tableContainer = <TableContainer key={activeTable.TableName} table={activeTable}/>
    }

    return (
      <div>
        <Nav />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2 sidebar">
              <Tables/>
            </div>
            <div className="col-sm-9 offset-sm-3 col-md-10 offset-md-2 main">
              {tableContainer}
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps)(Main);
