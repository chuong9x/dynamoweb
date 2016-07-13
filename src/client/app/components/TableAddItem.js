import React, { Component, PropTypes } from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import request from 'superagent';

import 'brace/mode/javascript';
import 'brace/theme/github';

import {typeToZeroValue} from '../util/ddb';


class TableAddItem extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      error: null
    }
  }
  
  initialEditorValue() {
    let initial = {};
    for (let attr in this.props.initialKeys) {
      let type = this.props.initialKeys[attr];
      initial[attr] = {
        [type]: typeToZeroValue[type]
      };
    };
    
    return JSON.stringify(initial, null, 2);
  }
  
  save() {
    let tableName = this.props.table.TableName;
    request.put('/api/'+tableName)
           .send(this.state.value)
           .set('Content-Type', 'application/json')
           .end((err, resp) => {
      if (err != null) {
        this.setState({error: resp.body.message});
      } else {
        this.setState({error: null});
      }
    });
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || 
           nextState.error != this.state.error;
  }
  
  onEditorChange(value) {
    this.setState({value: value})
  }

  renderCodeArea() {
    let initialValue = this.initialEditorValue();
    return (
      <AceEditor mode="javascript"
                 theme="github"
                 name="add-item-editor"
                 ref="editor"
                 onChange={this.onEditorChange.bind(this)}
                 height="20em"
                 value={initialValue}
                 editorProps={{"$blockScrolling": true}}/>
      )
  }
  
  onCloseError() {
    this.setState({error: null});
  }
  
  renderError() {
    if (this.state.error == null) {
      return null;
    }
    return (
      <div className="alert alert-danger alert-dismissible" role="alert">
        <button type="button" className="close" onClick={this.onCloseError.bind(this)} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>Error: </strong> {this.state.error}
      </div>
    )
  }

  render() {
    let table = this.props.table;
    return (
      <div>
        <button className="btn btn-secondary" data-toggle="modal" data-target="#add-item">Add Item</button>
        
        <div className="modal fade" id="add-item" tabIndex="-1" role="dialog" aria-labelledby="add-item" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Add Item</h4>
              </div>
              <div className="modal-body">
                {this.renderError()}
                {this.renderCodeArea()}
                {/* TODO: add a legend for DDB types */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.save.bind(this)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

TableAddItem.propTypes = {
  table: PropTypes.object,
  initialKeys: PropTypes.object
}

export default TableAddItem;
