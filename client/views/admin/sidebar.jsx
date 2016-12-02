import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

export default class Sidebar extends React.Component {
  render() {
    return <ul className="nav nav-sidebar">
      <li><a href="/admin"><i className="fa fa-home"></i> Home</a></li>
      <li><a href="/admin/add-product"><i className="fa fa-plus"></i> Add A Product</a></li>
      <li><a href="/admin/hidden-products"><i className="fa fa-eye-slash"></i> Hidden Products</a></li>
      <li><a href="/admin/deleted-products"><i className="fa fa-trash"></i> Deleted Products</a></li>
      <li><a href="/admin/pending-approval"><i className="fa fa-users"></i> Pending Approval</a></li>
    </ul>
  }
}
