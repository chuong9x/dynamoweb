import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import IndexList from './IndexList';
import { typeToRepr } from '../util/ddb';

class TableOverview extends Component {
    
  render() {
    let table = this.props.table;
    
    let hashKeyAttr = table.KeySchema.find(k => k.KeyType == "HASH").AttributeName;
    let hashKey = table.AttributeDefinitions.find(k => k.AttributeName == hashKeyAttr);
    let rangeKeyAttr =  table.KeySchema.find(k => k.KeyType == "RANGE").AttributeName;
    let rangeKey = table.AttributeDefinitions.find(k => k.AttributeName == rangeKeyAttr);
    
    return (
      <div>
        <dl className="dl-horizontal row">
          <dt>Hash Key</dt>
          <dd>{hashKey.AttributeName}
            <span className="text-muted"> ({typeToRepr[hashKey.AttributeType]})</span>
          </dd>
          <dt>Range Key</dt>
          <dd>{rangeKey.AttributeName}
            <span className="text-muted"> ({typeToRepr[rangeKey.AttributeType]})</span>
          </dd>
          
          <dt>Items</dt>
          <dd>{table.ItemCount}</dd>
          <dt>Size (bytes)</dt>
          <dd>{table.TableSizeBytes}</dd>
          
          <dt>Status</dt>
          <dd>{table.TableStatus}</dd>
        
          <dt>Read Throughput</dt>
          <dd>{table.ProvisionedThroughput.ReadCapacityUnits}</dd>
          <dt>Write Throughput</dt>
          <dd>{table.ProvisionedThroughput.WriteCapacityUnits}</dd>
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
