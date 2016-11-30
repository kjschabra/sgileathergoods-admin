import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { ProductsCollection, SGIProductCollection, ProductType, ProductGender, ProductImages } from '../../../imports/collections.js'
import { createContainer } from 'meteor/react-meteor-data';
import Loading from '../components/loading.jsx';

export class Modal extends React.Component {
  getProductName() {
    if (this.props.productId) {
      if (this.props.productLoading || this.props.imageLoading) {
        return <Loading />
      } else {
        return this.props.product.productName;
      }
    }
  }
  getProductDescription() {
    if (this.props.productId) {
      if (this.props.productLoading || this.props.imageLoading) {
        return <Loading />
      } else {
        if (!this.props.product.productDescription.includes('Test')) {
          return <p className="text-left text-muted">{this.props.product.productDescription}</p>;
        }
      }
    }
  }
  getProductImage() {
    if (this.props.imageId) {
      if (this.props.productLoading || this.props.imageLoading) {
        return <Loading />
      } else {
        return <img   src={this.props.image.url(store = "images")}
                      alt=""
                      className="img-responsive img-rounded"
                  />;
      }
    }
  }
  render() {
    return <div className="modal fade picture-modal" tabIndex="-1" role="dialog" aria-labelledby="picture-modal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title text-primary" id="myModalLabel">{this.getProductName()}</h4>
          </div>
          <div className="modal-body">
            {this.getProductImage()}
          </div>
          <div className="modal-footer">
            {this.getProductDescription()}
          </div>
        </div>
      </div>
    </div>
  }
}

export default Modal = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  if (props) {
    let productId = props.productId,
      imageId = props.imageId;


    let productSub = Meteor.subscribe('productById', productId),
      productImageSub = Meteor.subscribe('productImagesById', imageId),
      productCollectionSub = Meteor.subscribe('sgiProductCollection'),
      productTypeSub = Meteor.subscribe('productType'),
      productGenderSub = Meteor.subscribe('productGender');

    return {
      productLoading: !productSub.ready() || !productCollectionSub.ready() || !productTypeSub.ready() || !productGenderSub.ready(),
      imageLoading: !productImageSub.ready(),
      product: ProductsCollection.findOne({ _id: productId }),
      image: ProductImages.findOne({ _id: imageId }),
      producCollection: SGIProductCollection.find().fetch(),
      productType: ProductType.find().fetch(),
      productGender: ProductGender.find().fetch
    };
  }
}, Modal);