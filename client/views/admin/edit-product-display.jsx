import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';
import {ProductsCollection, ProductImages} from '../../../imports/collections.js';
import ProductFormDisplay from './action-product-form-display.jsx';
import Swal from 'sweetalert';
import RenderForm from './render-form.jsx';
import Product from './product.jsx';
import Loading from '../components/loading.jsx';
export default class EditProductDisplay extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
    return null;
  }
  formData(productData) {
    if (this.props.product && !_.isUndefined(this.props.product)) {
      let formData = [
        {
          labelValue: "Product Name",
          value: productData.name,
          label: "Product Name",
          tagDivClass: "col-md-10",
          tagClass: "form-control",
          labelClass: "col-sm-2",
          tagType: "text",
          tag: "input",
          placeholder: "Red Handbag",
          errors: ["empty"],
          ref: "productName"
        }, {
          labelValue: "Product Size",
          labelClass: "col-sm-2",
          additionalTag: [
            {
              value: productData.length,
              tagDivClass: "col-md-3",
              tagClass: "form-control",
              tagType: "text",
              tag: "input",
              placeholder: "24",
              errors: [
                "empty", "number"
              ],
              ref: "productSizeLength"
            }, {
              labelValue: "Product Width",
              value: productData.width,
              tagDivClass: "col-md-3",
              tagClass: "form-control",
              tagType: "text",
              labelClass: "col-md-1",
              tag: "input",
              placeholder: "10",
              errors: [
                "empty", "number"
              ],
              ref: "productSizeWidth"
            }, {
              labelValue: "Product Volume",
              value: productData.volume,
              tagDivClass: "col-md-3",
              tagClass: "form-control",
              tagType: "text",
              labelClass: "col-md-1",
              tag: "input",
              placeholder: "8",
              errors: [
                "empty", "number"
              ],
              ref: "productSizeVolume"
            }
          ]
        }, {
          labelValue: "Product Color",
          labelClass: "col-md-2",
          value: productData.colour,
          tagDivClass: "col-md-10",
          tagClass: "form-control",
          tag: "input",
          tagType: "text",
          placeholder: "Black, Red, Brown",
          errors:["empty"],
          ref: "productColor"
        }, {
          labelValue: "Product Price",
          labelClass: "col-md-2",
          value: productData.price,
          tagDivClass: "col-md-10",
          tagClass: "form-control",
          tagType: "text",
          tag: "input",
          tagType: "text",
          placeholder: "$130 CAD",
          errors:["empty"],
          ref: "productPrice"
        }, {
          labelValue: "Product Description",
          value: productData.description,
          tagDivClass: "col-md-10",
          tagClass: "form-control",
          tagType: "text",
          labelClass: "col-md-2",
          tag: "textarea",
          placeholder: "This handbag can carry...",
          errors:["empty"],
          ref: "productDescription"
        }, {
          labelValue: "Product Image",
          value: productData.image.original.name,
          tagDivClass: "col-md-5",
          tagClass: "form-control",
          tagType: "file",
          labelClass: "col-md-2",
          tag: "input",
          placeholder: "Select an Image",
          ref: "productImage",
          additionalTag: [
            {
              tag: "img",
              alt: productData.image.original.name,
              tagClass: "img-responsive thumbnail",
              tagDivClass: "col-md-5",
              src: productData.image.url(store = "images")
            }
          ]
        }
      ];
      return formData;
    }
  }
  saveProduct(event) {
    event.preventDefault();
    let hasErrors = false;
    let formData = this.formData(this.props.product);
    let formValues =[];

    formData.map(function(formGet, k) {
      let err = {};
      if (formGet && formGet.additionalTag && formGet.additionalTag.length > 0){

      }
      else {
        if ((formGet.tag === "input" || formGet.tag === "textarea") && formGet.errors){
          let elemValue = document.getElementsByName(formGet.ref)[0].value.trim();
          err.message = SGI.globalInputErrors(elemValue, formGet.errors);
          err.errTag = formGet.ref;
          err.value = elemValue
        }
      }
      if (err && err.message  && !_.isEmpty(err.message) ) {
        document.getElementById(err.errTag).innerHTML = err.message.join(" and ");
        err.validating = true;
      }

      formValues.push(err);
    });

    formValues.map(function(errorObj){
      if (errorObj && errorObj.validating){
        hasErrors = true;
      }
    });
    if (!hasErrors){
      Meteor.call("updateProduct", formValues, function(err, result){
        if (err) {
          Swal ("Error!", err.error, "error");
        }
        if (result) {
          Swal("Updated!", result, "Success");
        }
      });
    }

    // let productSizeLength = parseFloat(ReactDOM.findDOMNode(this.refs.productSizeLength).value.trim());
    // let productSizeWidth = parseFloat(ReactDOM.findDOMNode(this.refs.productSizeWidth).value.trim());
    // let productSizeVolume = parseFloat(ReactDOM.findDOMNode(this.refs.productSizeVolume).value.trim());
    // let productDescription = ReactDOM.findDOMNode(this.refs.productDescription).value.trim();
    // let productImages = this.props.fileAdded;
  }
  deleteProduct(event) {
    Swal({
      title:"Delete Product",
      text: "Are you sure you want to delete this product?",
      type:"warning",
    });
  }
  toggleShowOrHide(event) {
    Swal({
      title:"Hide Product",
      text: "Are you sure you want to hide this product?",
      type:"warning"
    });
  }
  onUpdate(event) {
    let elemName = event.target.name;
    let elemValue = event.target.value.trim();
    let elemDataErrors = event.target.dataset.errors;
    let err = SGI.globalInputErrors(elemValue, elemDataErrors.split(','));
    if (err){
      let erroMessage = err.join(" and ");
      document.getElementById(elemName).innerHTML = erroMessage;
    }
  }
  renderEditProductDisplay() {
    if (!this.props.productLoading) {
      return <RenderForm formClass="form-horizontal" onUpdate={this.onUpdate} formData={this.formData(this.props.product)}/>
    } else {
      return <Loading/>
    }
  }
  renderOptionsMenu() {
    let hide;
    if (this.props.product && this.props.product.hidden) {
      hide = <li data-toggle="tooltip" onClick={this.toggleShowOrHide.bind(this)} ref="toggleShowOrHide" data-placement="top" title="Show">
        <i className="fa fa-eye-slash fa-2x text-primary"></i>
      </li>
    } else {
      hide = <li data-toggle="tooltip" onClick={this.toggleShowOrHide.bind(this)} ref="toggleShowOrHide" data-placement="top" title="Hide">
        <i className="fa fa-eye fa-2x text-primary"></i>
      </li>
    }
    return <div className="col-md-12">
      <ul className="list-inline text-right">
        <li data-toggle="tooltip" onClick={this.saveProduct.bind(this)} ref="saveProduct" data-placement="top" title="Save">
          <i className="fa fa-check text-success fa-2x"></i>
        </li>
        {hide}
        <li data-toggle="tooltip" onClick={this.deleteProduct.bind(this)} ref="deleteProduct" data-placement="top" title="Delete">
          <i className="fa fa-trash text-danger fa-2x"></i>
        </li>
      </ul>
    </div>
  }
  render() {
    return <div className="row">
      <h3 className="text-center lead text-muted">Edit Product</h3>
      {this.renderOptionsMenu()}
      {this.renderEditProductDisplay()}
    </div>;
  }
}
EditProductDisplay.propTypes = {
  //products: PropTypes.array.isRequired,
  //name:PropTypes.String.isRequired,
  //size:PropTypes.String.isRequired,
}
export default EditProductDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let sub = Meteor.subscribe('productById', props.productId),
    product = ProductsCollection.findOne({_id: props.productId}),
    imageSub = null,
    productImage = null;
  if (sub.ready() && !_.isUndefined(product)) {
    imageSub = Meteor.subscribe('productImagesById', product.imageIds);
    if (imageSub.ready()) {
      productImage = ProductImages.findOne({_id: product.imageIds});
      product.image = productImage;
    }
  }
  return {
    productLoading: (!sub.ready() || _.isUndefined(product.image))
      ? true
      : false,
    product: product,
  };
}, EditProductDisplay);
