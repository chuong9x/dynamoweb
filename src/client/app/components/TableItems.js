import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import request from 'superagent';

import TableAddItem from './TableAddItem';
import {getAttrType} from '../util/ddb';

function mapStateToProps(state) {
  return {
  }
}

class TableItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      addItem: null
    }
  }
  
  refreshItems() {
    let tableName = this.props.table.TableName;
    request.get('/api/scan/'+tableName).end((err, resp) => {
      if (err) {
        console.error(err);
        return
      }
      this.setState({items: resp.body.Items})
    });
  }

  componentDidMount() {
    this.refreshItems();
  }

  onEditItem() {

  }

  attrsToType() {
    let attrsToType = {};
    let items = this.state.items;

    let toCheck = Math.min(items.length, 10);  // Check 10 items for attrs
    let seenAttrs = new Set();
    for (let i=0; i < toCheck; i++) {
      let attrs = Object.keys(items[i]);
      for (let attr of attrs) {
        if (seenAttrs.has(attr)) {
          continue;
        }
        seenAttrs.add(attr);
        attrsToType[attr] = getAttrType(this.props.table, attr)
      };
    }
    return attrsToType;
  }

  renderItem(item, headers, key) {
    return (
      <tr key={key}>
        <td>
          <button type="button" className="btn btn-default btn-sm"
                  onClick={this.onEditItem.bind(this, item)}
                  aria-label="Edit">
            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
          </button>
        </td>
        {headers.map((header, idx) => {
          let attr = item[header];
          let types = Object.keys(attr);
          let value = attr[types[0]];
          return (
            <td key={idx}>{value}</td>
          )
        })}
      </tr>
    )
  }

  addItem() {
      let attrsToType = this.attrsToType();
      let headers = Object.keys(attrsToType);
      this.setState({
        'addItem': <TableAddItem table={this.props.table}
                                 initialKeys={attrsToType}
                                 onAddFinished={this.onAddFinished.bind(this)}/>
      });
  }

  onAddFinished(didAdd) {
    if (didAdd) {
      this.refreshItems();
    }
    this.setState({
      'addItem': null
    })
  }

  render() {
    let table = this.props.table;

    let attrsToType = this.attrsToType();
    let headers = Object.keys(attrsToType);

    let i = 0;
    let items = this.state.items.map(item => this.renderItem(item, headers, ++i))

    return (
      <div>
        <button className="btn btn-secondary" onClick={this.addItem.bind(this)}>
          Add Item
        </button>
        {this.state.addItem}

        <br />
        <table className="table table-sm">
          <thead className="thead-default">
            <tr>
              <th></th>
              {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    );
  }

}

TableItems.propTypes = {
  table: PropTypes.object,
}

export default connect(mapStateToProps)(TableItems);
