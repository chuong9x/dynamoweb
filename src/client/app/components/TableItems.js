import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import request from 'superagent';

import TableEditItem from './TableEditItem';
import {getAttrType, getKeys} from '../util/ddb';

function mapStateToProps(state) {
  return {
  }
}

class TableItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      editItem: null
    }
  }

  refreshItems() {
    // TODO: could probably turn semi-transparent during refresh
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

  addItem() {
      let attrsToType = this.attrsToType();
      let headers = Object.keys(attrsToType);
      this.setState({
        'editItem': <TableEditItem mode="add"
                                   table={this.props.table}
                                   initialKeys={attrsToType}
                                   onFinished={this.onEditFinished.bind(this)}/>
      });
  }

  onEditFinished(didEdit) {
    if (didEdit) {
      this.refreshItems();
    }
    this.setState({
      'editItem': null
    })
  }

  onEditItem(item) {
    let attrsToType = this.attrsToType();
    let headers = Object.keys(attrsToType);
    this.setState({
      'editItem': <TableEditItem mode="edit"
                                 item={item}
                                 initialKeys={attrsToType}
                                 table={this.props.table}
                                 onFinished={this.onEditFinished.bind(this)}/>
    });
  }

  onDeleteItem(item) {
    let key = getKeys(this.props.table, item)
    request.delete('/api/'+this.props.table.TableName).send(key).end((err, resp) => {
      if (err) {
        console.error(err);
      }
      this.refreshItems();
    });
  }

  attrsToType() {
    let attrsToType = {};
    let seenAttrs = new Set();

    // First add attr definitions
    for (var attr of this.props.table.AttributeDefinitions) {
      seenAttrs.add(attr.AttributeName);
      attrsToType[attr.AttributeName] = attr.AttributeType;
    }

    let items = this.state.items;

    // Now add attrs from a sample of items
    let toCheck = Math.min(items.length, 10);  // Check 10 items for attrs

    for (let i=0; i < toCheck; i++) {
      let attrs = Object.keys(items[i]);
      for (let attr of attrs) {
        if (!seenAttrs.has(attr)) {
          seenAttrs.add(attr);
          attrsToType[attr] = Object.keys(items[i][attr])[0];
        }
      }
    }
    return attrsToType;
  }

  renderItem(item, headers, key) {
    return (
      <tr key={key}>
        {headers.map((header, idx) => {
          {/* TODO: ensure that hash key is first */}
          let attr = item[header];
          let value = null;
          if (attr != undefined) {
            let types = Object.keys(attr);
            value = attr[types[0]];
          } else {
            value = "";
          }
          if (idx == 0) {
            return (
              <td key={idx}>
                <a href="#" onClick={this.onEditItem.bind(this, item)}>{String(value)}</a>
              </td>
            )
          } else {
            return (<td key={idx}>{String(value)}</td>)
          }
        })}
        <td width="35px">
          <button type="button" className="btn btn-sm btn-outline-danger"
                  onClick={this.onDeleteItem.bind(this, item)}
                  aria-label="Delete">
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </td>
      </tr>
    )
  }

  render() {
    let table = this.props.table;

    let attrsToType = this.attrsToType();
    let headers = Object.keys(attrsToType);

    let i = 0;
    let items = this.state.items.map(item => this.renderItem(item, headers, ++i))

    return (
      <div>
        <button className="add-item btn btn-primary btn-sm" onClick={this.addItem.bind(this)}>
          <i className="fa fa-plus" aria-hidden="true"></i> Add Item
        </button>
        {this.state.editItem}

        <br />
        <table className="table table-sm table-bordered table-hover">
          <thead className="thead-default">
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
              <th></th>{/* Delete action */}
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
