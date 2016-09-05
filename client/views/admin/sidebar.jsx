import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

export default class Sidebar extends React.Component {
  render() {
    return <ul className="nav nav-sidebar">
      <li><a href="/admin">Home</a></li>
      <li><a href="/admin/add-product">Add A Product</a></li>
      <li><a href="/admin/hidden-products">Hidden Products</a></li>
      <li><a href="/admin/deleted-products">Deleted Products</a></li>
    </ul>
  }
}
