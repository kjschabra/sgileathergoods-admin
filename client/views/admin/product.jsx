import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { ProductImages } from '../../../imports/collections.js';
import Loading from '../components/loading.jsx';
import Swal from 'sweetalert';

export class Product extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
    return null;
  }
  getProductImgClass() {
    let self = this;
    if (self.props.productCollection && self.props.data) {
      let obj = _.where(self.props.productCollection, { _id: self.props.data.collection });
      if (obj[0] && !_.isEmpty(obj[0])) {
        if (obj[0].name === "Paris Collection") {
          return "collection paris-collection-img-border";
        } else if (obj[0].name === "Safari Collection") {
          return "collection safari-collection-img-border";
        } else if (obj[0].name === "Eternity Collection") {
          return "collection eternity-collection-img-border";
        } else {
          return "collection sgi-brand-img-border";
        }
      }
    }
  }
  toggleDeleteProduct(event) {
    let self = this.props.data;
    Swal({
      title: "Delete Product",
      text: "Are you sure you want to delete this product?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d02d00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No!",
      closeOnConfirm: false,
      closeOnCancel: true
    }, function(isConfirm) {
      if (isConfirm) {
        Meteor.call("toggleDeleteProduct", self._id, function(err, result) {
          if (err) {
            swal("Oops..", err, "error");
          }
          if (result) {
            swal("Product Deleted", result, "success");
            FlowRouter.go('/admin');
          }
        });
      }
    });
  }
  renderEditMenu() {
    return <div className="row text-right text-info">
      <ul className="list-inline">
        <li>
          <a href={FlowRouter.url('AdminEditProduct', {productId:this.props.data._id} )}>
            <span className="label label-info">
              <i className="fa fa-pencil" data-toggle="tooltip" data-placement="top" title="Edit"></i>
            </span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="label label-danger" onClick={this.toggleDeleteProduct.bind(this)}>
              <i className="fa fa-trash" data-toggle="tooltip" data-placement="top" title="Delete"></i>
            </span>
          </a>
        </li>
      </ul>
    </div>
  }
  displayImage() {
    if (this.props.imageLoading) {
      return <Loading/>;
    } else {
      return <img onClick={this.props.loadModal}
                  data-product-id={this.props.data._id}
                  data-image-id={this.props.image._id}
                  src={this.props.image.url(store = "images")}
                  alt=""
                  className={this.getProductImgClass()+ " img-responsive thumbnail "}
                  />;
    }
  }
  displaySize() {
    var length = "",
      width = "",
      volume = "";
    if (this.props.data && this.props.data.productSizeLength && this.props.data.productSizeLength !== "0") {
      length = this.props.data.productSizeLength + "in";
    }
    if (this.props.data && this.props.data.productSizeWidth && this.props.data.productSizeWidth !== "0") {
      width = " x " + this.props.data.productSizeWidth + "in";
    }
    if (this.props.data && this.props.data.productSizeVolume && this.props.data.productSizeVolume !== "0") {
      volume = " x " + this.props.data.productSizeVolume + "in";
    }

    return length + " " + width + " " + volume;
  }
  render() {
    return <div className="col-md-3">
      {this.renderEditMenu()}
      {this.displayImage()}
      <h5 className="text-info">{this.props.data.productName}<br/>
        <small className="text-primary">{this.displaySize()}</small><br/>
      </h5>
      <h5>
        <small className="text-muted">Available in:
          <strong>&nbsp;{this.props.data.productColor}</strong>
        </small>
      </h5>
      <p className="text-muted">{this.props.data.productDescription}</p>
      <h4 className="text-right">
        <span className="label label-primary">{this.props.data.productPrice}</span>
      </h4>
      <hr/>
    </div>
  }
}

export default Product = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let imageIds = props.data.productImageId,
    productImages = {
      loading: true,
      data: []
    };
  let sub = Meteor.subscribe('productImagesById', imageIds);
  let data = ProductImages.findOne({ _id: imageIds });
  return {
    imageLoading: !sub.ready(),
    image: data
  };
}, Product);