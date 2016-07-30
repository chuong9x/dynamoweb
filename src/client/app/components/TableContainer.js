import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TableOverview from './TableOverview';
import TableItems from './TableItems';

function mapStateToProps(state) {
  return {
  }
}

class TableContainer extends Component {
    
  render() {
    let table = this.props.table;
    let tableName = table.TableName;
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <h2 className="table-title">{tableName}</h2>
          </div>
        </div>
        
        <ul className="nav nav-tabs">
          <li className="nav-item active">
            <a className="nav-link" data-toggle="tab" href="#overview" role="tab">Overview</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#items" role="tab">Items</a>
          </li>
        </ul>
        
        <div className="tab-content">
          <br />
          <div className="tab-pane active" id="overview" role="tabpanel">
            <TableOverview table={table}/>
          </div>
          <div className="tab-pane" id="items" role="tabpanel">
            <TableItems table={table}/>
          </div>
        </div>
      </div>
    );
  }

}


TableContainer.propTypes = {
  table: PropTypes.object,
}

export default connect(mapStateToProps)(TableContainer);
