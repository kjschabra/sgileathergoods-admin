import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {ProductsCollection} from '../../../imports/collections.js'

import Product from './product.jsx';
import Loading from '../components/loading.jsx';

export default class ProductsDisplay extends React.Component {
  componentDidMount() {
    return null;
  }
  renderProducts() {
    if (this.props.productsLoading) {
      return <Loading />
    }else {
      return this.props.products.map((product) => (
        <Product key={product._id} data={product} />
      ));
    }
  }
  render() {
    return <div className="col-md-12">
      <h5 className="lead text-center text-muted">SGI</h5>
      <div className="col-md-12">
        {this.renderProducts()}
      </div>
    </div>
  }
}

ProductsDisplay.propTypes = {
  //products: PropTypes.array.isRequired,
}

export default ProductsDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let sub = Meteor.subscribe('productsCollection');

  return {
    products:ProductsCollection.find({}).fetch(),
    productsLoading: !sub.ready(),
  };
}, ProductsDisplay);
