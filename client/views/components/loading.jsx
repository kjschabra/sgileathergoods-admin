import React, {Component, PropTypes} from 'react';
export default class Loading extends React.Component {
  render() {
    return <div className="row" style={{padding:30+"px"}}>
      <div className="col-md-12 text-info text-center">
        <i className="fa fa-cog fa-spin fa-5x fa-fw"></i>
      </div>
    </div>
  }
}
