import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import IndexList from './IndexList';
import { typeToRepr } from '../util/ddb';

class TableOverview extends Component {

  render() {
    let table = this.props.table;

    let hashKeyAttr = table.KeySchema.find(k => k.KeyType == "HASH").AttributeName;
    let hashKey = table.AttributeDefinitions.find(k => k.AttributeName == hashKeyAttr);

    let rangeKeySchema = table.KeySchema.find(k => k.KeyType == "RANGE");
    let rangeKeyAttr =  rangeKeySchema ? rangeKeySchema.AttributeName : null;
    let rangeKey = rangeKeyAttr ? table.AttributeDefinitions.find(k => k.AttributeName == rangeKeyAttr): null;

    return (
      <div>
        <dl className="row">
          <dt className="col-md-3">Hash Key</dt>
          <dd className="col-md-9">{hashKey.AttributeName}
            <span className="text-muted"> ({typeToRepr[hashKey.AttributeType]})</span>
          </dd>
          <dt className="col-md-3">Range Key</dt>
          <dd className="col-md-9">
          {(() => {
            if (rangeKey) {
              return (
                <span>
                  {rangeKeyAttr}
                  <span className="text-muted"> ({typeToRepr[rangeKey.AttributeType]})</span>
                </span>
              )
            }
            return (<span className="text-muted">None</span>)
          })()}
          </dd>

          <dt className="col-md-3">Items</dt>
          <dd className="col-md-9">{table.ItemCount}</dd>
          <dt className="col-md-3">Size (bytes)</dt>
          <dd className="col-md-9">{table.TableSizeBytes}</dd>

          <dt className="col-md-3">Status</dt>
          <dd className="col-md-9">{table.TableStatus}</dd>

          <dt className="col-md-3">Read Throughput</dt>
          <dd className="col-md-9">{table.ProvisionedThroughput.ReadCapacityUnits}</dd>
          <dt className="col-md-3">Write Throughput</dt>
          <dd className="col-md-9">{table.ProvisionedThroughput.WriteCapacityUnits}</dd>
        </dl>

        <h4>Local Secondary Indexes</h4>
        <IndexList table={table} indexes={table.LocalSecondaryIndexes}/>

        <br />
        <h4>Global Secondary Indexes</h4>
        <IndexList table={table} indexes={table.GlobalSecondaryIndexes}/>
      </div>
    );
  }

}


TableOverview.propTypes = {
  table: PropTypes.object,
}

export default TableOverview;
