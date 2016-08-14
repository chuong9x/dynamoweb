import React, { Component, PropTypes } from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import request from 'superagent';

import 'brace/mode/javascript';
import 'brace/theme/github';

import {typeToZeroValue, orderObj} from '../util/ddb';


class TableEditItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.initialEditorValue(),
      error: null,
      didEdit: false  // keep track of whether we successfully edited something
    }
  }


  // TODO: ensure order is consistent with table headings
  initialEditorValue() {
    let initial = null;
    if (this.props.mode == "edit") {
      initial = orderObj(this.props.item, Object.keys(this.props.initialKeys));
    } else {
      initial = {};
      for (let attr in this.props.initialKeys) {
        let type = this.props.initialKeys[attr];
        initial[attr] = {
          [type]: typeToZeroValue[type]
        };
      };
    }
    return JSON.stringify(initial, null, 2);
  }

  componentDidMount() {
    $(this.refs.modal).on('hide.bs.modal', this.modalClosed.bind(this));
    this.show();
  }

  modalClosed() {
    this.props.onFinished(this.state.didEdit);
  }

  save() {
    // TODO: warn about changing a hash/range key?
    let tableName = this.props.table.TableName;
    request.put('/api/'+tableName)
           .send(this.state.value)
           .set('Content-Type', 'application/json')
           .end((err, resp) => {
      if (err) {
        this.setState({error: resp.body.message});
      } else {
        this.setState({error: null, didEdit: true});
        this.close();
      }
    });
  }

  show() {
    $(this.refs.modal).modal('show');
  }

  close() {
    $(this.refs.modal).modal('hide');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props ||
           nextState.error != this.state.error;
  }

  onEditorChange(value) {
    this.setState({value: value})
  }

  renderCodeArea() {
    return (
      <AceEditor mode="javascript"
                 theme="github"
                 name="add-item-editor"
                 ref="editor"
                 key={1}
                 onChange={this.onEditorChange.bind(this)}
                 height="100%"
                 value={this.state.value}
                 tabSize={2}
                 editorProps={{"$blockScrolling": true, useSoftTabs: true}}/>
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
    let mode = this.props.mode;
    let modeTitle = mode.charAt(0).toUpperCase() + mode.slice(1);

    return (
      <div className="modal fade" id="add-item" ref="modal" tabIndex="-1" role="dialog" aria-labelledby="add-item" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title">{modeTitle} Item</h4>
            </div>
            <div className="modal-body codearea">
              {this.renderError()}
              {this.renderCodeArea()}
              {/* TODO: add a legend for DDB types */}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.close.bind(this)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={this.save.bind(this)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

TableEditItem.propTypes = {
  table: PropTypes.object,
  mode: PropTypes.string,
  initialKeys: PropTypes.object,
  item: PropTypes.object,
  onFinished: PropTypes.func
}

export default TableEditItem;
