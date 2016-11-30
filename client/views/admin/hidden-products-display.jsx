import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { ProductsCollection } from '../../../imports/collections.js'

import { Product } from './product.jsx';
import Loading from '../components/loading.jsx';

export class HiddenProductsDisplay extends React.Component {
  componentDidMount() {
    return null;
  }
  renderProducts() {
    if (this.props.productsLoading) {
      return <Loading />
    } else {
      return this.props.products.map((product) => (
        <Product key={product._id} data={product} />
      ));
    }
  }
  render() {
    return <div className="col-md-12">
      <h5 className="lead text-center text-muted">SGI - Hidden Products</h5>
      <div className="col-md-12">
        {this.renderProducts()}
      </div>
    </div>
  }
}

export default HiddenProductsDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let sub = Meteor.subscribe('hiddenProductsCollection'),
    product = ProductsCollection.find({ deleted: false, hidden: true }).fetch();
  return {
    products: product,
    productsLoading: !sub.ready(),
  };
}, HiddenProductsDisplay);