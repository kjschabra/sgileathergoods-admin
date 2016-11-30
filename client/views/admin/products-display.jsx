import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {ProductsCollection, SGIProductCollection, ProductType, ProductGender} from '../../../imports/collections.js';
import Modal from '../components/modal.jsx';
import Product from './product.jsx';
import Loading from '../components/loading.jsx';
import {DocHead} from 'meteor/kadira:dochead';



export class ProductsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products : undefined,
      active: undefined,
      modal:{
        productId: null,
        imageId: null
      }
    };
  }
  setDisplayToCollection(evt) {
    let value = evt.target.dataset.display;

    if (this.state && this.state.products && this.state.active && this.state.active === value) {
      this.setState({products: undefined, active: undefined});
    } else {
      this.setState({
        products: ProductsCollection.find({collection:value},{sort: {addedOn: -1} }).fetch(),
        active: value
      });
    }
  }
  renderFilters() {
    let self = this;
    return <ul className="list-inline text-left">
      {this.props.productCollection.map(function(collection, k) {
        let activeClass = "";
        if (self.state.active && self.state.active === collection._id) {
          activeClass = collection.activeButtonClass+"-active";
        } else {
          activeClass= collection.activeButtonClass;
        }
        return <li key={k}>
          <button className={"btn btn-lg "+activeClass} onClick={self.setDisplayToCollection.bind(self)} data-display={collection._id}>
            {collection.name}
          </button>
        </li>
      })}
    </ul>
  }
  loadModal(evt) {
    let productId = evt.target.dataset.productId,
        imageId = evt.target.dataset.imageId;

    this.setState({modal: {productId:productId, imageId:imageId } } );

    $('.modal').modal('toggle');
  }
  checkModal() {
    return <Modal productId={this.state.modal.productId || ""} imageId={this.state.modal.imageId || ""}/>
  }
  renderProducts() {
    let self = this;
    let displayObj = undefined
    if (this.props.productsLoading) {
      return <Loading/>;
    } else if (this.state.products) {
      displayObj = this.state.products;
    } else {
      displayObj = this.props.products;
    }
    return displayObj.map(function(product, k){
        return <Product key={product._id}
                        data={product}
                        productCollection={self.props.productCollection}
                        productGender={self.props.productGender}
                        productType={self.props.productType}
                        loadModal={self.loadModal.bind(this)} />
      }, this);
  }
  render() {
    return <div>
      {this.checkModal()}
      <div className="col-md-12">
        {this.renderFilters()}
        <hr/>
      </div>
      {this.renderProducts()}
    </div>
  }
}
ProductsDisplay.propTypes = {
}
export default ProductsDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let numberOfProducts      = Counts.get('numberOfProducts'),
      sub                   = Meteor.subscribe('productsCollection', numberOfProducts),
      sub2                  = Meteor.subscribe("countOfProducts"),
      productCollectionSub  = Meteor.subscribe('sgiProductCollection'),
      productTypeSub        = Meteor.subscribe('productType'),
      productGenderSub      = Meteor.subscribe('productGender');

  let productQuery = {
    deleted:false,
    hidden: false,
  };

  let product = ProductsCollection.find(
    productQuery,
    {
      sort: {
        addedOn: -1
      }
    }).fetch();
  return {
    productsLoading   : !sub.ready() || !sub2.ready() || !productCollectionSub.ready() || !productTypeSub.ready() || !productGenderSub.ready(),
    products          : product,
    productCollection : SGIProductCollection.find().fetch(),
    productType       : ProductType.find().fetch(),
    productGender     : ProductGender.find().fetch()
  };
}, ProductsDisplay);
