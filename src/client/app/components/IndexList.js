import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { typeToRepr } from '../util/ddb';

function mapStateToProps(state) {
  return {
  }
}

export default class IndexList extends Component {

  renderIndex(index) {
    let table = this.props.table;

    let hashKeyAttr = index.KeySchema.find(k => k.KeyType == "HASH").AttributeName;
    let hashKey = table.AttributeDefinitions.find(k => k.AttributeName == hashKeyAttr);
    let rangeKeyAttr =  index.KeySchema.find(k => k.KeyType == "RANGE").AttributeName;
    let rangeKey = table.AttributeDefinitions.find(k => k.AttributeName == rangeKeyAttr);

    return (
      <tr key={index.IndexName}>
        <th scope="row">{index.IndexName}</th>
        <td>{hashKey.AttributeName} <span className="text-muted">({typeToRepr[hashKey.AttributeType]})</span></td>
        <td>{rangeKey.AttributeName} <span className="text-muted">({typeToRepr[rangeKey.AttributeType]})</span></td>
        <td>{index.Projection.ProjectionType}</td>
        <td>{index.ItemCount}</td>
        <td>{index.IndexSizeBytes}</td>
      </tr>
    )
  }

  renderIndexes(indexes) {
    return (
      <table className="table table-hover table-sm">
        <thead className="thead-default">
          <tr>
            <th>Name</th>
            <th>Hash Key</th>
            <th>Range Key</th>
            <th>Projection</th>
            <th>Items</th>
            <th>Size (bytes)</th>
          </tr>
        </thead>
        <tbody>
          {indexes.map(idx => {return this.renderIndex(idx)})}
        </tbody>
      </table>
    );
  }

  renderNoIndexes() {
    return (
      <p className="text-muted">None</p>
    )
  }

  render() {
    let indexes = this.props.indexes;
    return indexes ? this.renderIndexes(indexes) : this.renderNoIndexes();
  }

}

IndexList.propTypes = {
  table: PropTypes.object,
  indexes: PropTypes.array,
}

export default connect(mapStateToProps)(IndexList);
