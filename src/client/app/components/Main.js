import React from 'react';
import { connect } from 'react-redux';

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
      <div className="container">
        <div className="row">
          <div className="col-lg-2">
            <Tables/>
          </div>
          <div className="col-lg-10">
            {tableContainer}
          </div>
        </div>
      </div>
    )
  }

}

export default connect(mapStateToProps)(Main);
