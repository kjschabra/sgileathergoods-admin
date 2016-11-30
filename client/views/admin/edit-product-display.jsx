import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { ProductsCollection, ProductImages, SGIProductCollection, ProductType, ProductGender } from '../../../imports/collections.js';
import { ProductFormDisplay } from './action-product-form-display.jsx';
import Swal from 'sweetalert';
import { RenderForm } from './render-form.jsx';
import { Product } from './product.jsx';
import Loading from '../components/loading.jsx';

export class EditProductDisplay extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
    return null;
  }
  formData(productData) {
    let self = this;
    if (this.props.product && !_.isUndefined(this.props.product)) {
      let formData = [{
        labelValue: "Product Name",
        value: productData.productName,
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
        additionalTag: [{
          value: productData.productSizeLength,
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
          value: productData.productSizeWidth,
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
          value: productData.productSizeVolume,
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
        }]
      }, {
        labelValue: "Product Color",
        labelClass: "col-md-2",
        value: productData.productColor,
        tagDivClass: "col-md-10",
        tagClass: "form-control",
        tag: "input",
        tagType: "text",
        placeholder: "Black, Red, Brown",
        errors: ["empty"],
        ref: "productColor"
      }, {
        labelValue: "Product Price",
        labelClass: "col-md-2",
        value: productData.productPrice,
        tagDivClass: "col-md-10",
        tagClass: "form-control",
        tagType: "text",
        tag: "input",
        tagType: "text",
        placeholder: "$130 CAD",
        errors: ["empty"],
        ref: "productPrice"
      }, {
        labelValue: "Product Collection",
        labelClass: "col-sm-2",
        additionalTag: [{
          value: self.props.sgiProductCollection,
          tagDivClass: "col-md-3",
          tagClass: "form-control",
          tagType: "select",
          tag: "select",
          errors: ["empty"],
          ref: "collection"
        }, {
          value: self.props.productType,
          tagDivClass: "col-md-3",
          tagClass: "form-control",
          tagType: "select",
          tag: "select",
          errors: ["empty"],
          ref: "productType"
        }, {
          value: self.props.productGender,
          tagDivClass: "col-md-3",
          tagClass: "form-control",
          tagType: "select",
          tag: "select",
          errors: ["empty"],
          ref: "productGender"
        }]
      }, {
        labelValue: "Product Description",
        value: productData.productDescription,
        tagDivClass: "col-md-10",
        tagClass: "form-control",
        tagType: "text",
        labelClass: "col-md-2",
        tag: "textarea",
        placeholder: "This handbag can carry...",
        errors: ["empty"],
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
        additionalTag: [{
          tag: "img",
          alt: productData.image.original.name,
          tagClass: "img-responsive thumbnail",
          tagDivClass: "col-md-5",
          src: productData.image.url(store = "images")
        }]
      }];
      return formData;
    }
  }
  saveProduct(event) {
    event.preventDefault();
    let hasErrors = false;
    let formData = this.formData(this.props.product);
    let formValues = [];
    let additionalTags = [];
    formData.map(function(formGet, k) {
      let err = {};
      if (formGet && formGet.additionalTag && formGet.additionalTag.length > 0) {
        formGet.additionalTag.map(function(tag, i) {
          if ((tag.tag === "input" || tag.tag === "textarea" || tag.tag === "select") && tag.errors) {
            let additionErr = {};
            let elemValue = document.getElementsByName(tag.ref)[0].value.trim();
            additionErr.message = SGI.globalInputErrors(elemValue, tag.errors);
            additionErr.tag = tag.ref;
            additionErr.value = elemValue;
            if (additionErr && additionErr.message && !_.isEmpty(additionErr.message)) {
              document.getElementById(additionErr.tag).innerHTML = additionErr.message.join(" and ");
              additionErr.validating = true;
            }
            additionalTags.push(additionErr);
          }
        });
      } else {
        if ((formGet.tag === "input" || formGet.tag === "textarea") && formGet.errors) {
          let elemValue = document.getElementsByName(formGet.ref)[0].value.trim();
          err.message = SGI.globalInputErrors(elemValue, formGet.errors);
          err.tag = formGet.ref;
          err.value = elemValue
        }
      }
      if (err && err.message && !_.isEmpty(err.message)) {
        document.getElementById(err.tag).innerHTML = err.message.join(" and ");
        err.validating = true;
      }
      formValues.push(err);
    });
    if (additionalTags && !_.isEmpty(additionalTags)) {
      formValues = _.union(formValues, additionalTags);
    }
    formValues.map(function(errorObj) {
      if (errorObj && errorObj.validating) {
        hasErrors = true;
      }
    });
    if (!hasErrors) {
      Meteor.call("updateProduct", this.props.productId, formValues, function(err, result) {
        if (err) {
          Swal("Error!", err, "error");
        }
        if (result) {
          Swal("Updated!", result, "success");
        }
      });
    }
  }
  toggleDeleteProduct(event) {
    let self = this.props.product,
      toggle = (self && self.deleted) ? "restore" : "delete",
      toggleTitle = (self && self.deleted) ? "Restore" : "Delete";
    Swal({
      title: toggleTitle + " Product",
      text: "Are you sure you want to " + toggle + " this product?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e5a434",
      confirmButtonText: "Yes, " + toggle + " it!",
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
  toggleShowOrHide(event) {
    let self = this.props.product,
      toggle = (self && self.hidden) ? "show" : "hide",
      toggleTitle = (self && self.hidden) ? "Show" : "Hide";
    Swal({
      title: toggleTitle + " Product",
      text: "Are you sure you want to " + toggle + " this product?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e5a434",
      confirmButtonText: "Yes, " + toggle + " it!",
      cancelButtonText: "No!",
      closeOnConfirm: false,
      closeOnCancel: true
    }, function(isConfirm) {
      if (confirm) {
        Meteor.call("toggleHideProduct", self._id, function(err, result) {
          if (err) {
            swal("Oops..", err, "error");
          }
          if (result) {
            swal("Product Hidden", result, "success");
            FlowRouter.go('/admin');
          }
        });
      }
    });
  }
  onUpdate(event) {
    let elemName = event.target.name;
    let elemValue = event.target.value.trim();
    let elemDataErrors = event.target.dataset.errors;
    let err = SGI.globalInputErrors(elemValue, elemDataErrors.split(','));
    if (err) {
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
    let hideOption = <li></li>,
      deleteOption = <li></li>;
    if (this.props.product && this.props.product.hidden) {
      hideOption = <li data-toggle="tooltip" onClick={this.toggleShowOrHide.bind(this)} ref="toggleShowOrHide" data-placement="top" title="Show">
        <i className="fa fa-eye-slash fa-2x text-primary"></i>
      </li>
    } else {
      hideOption = <li data-toggle="tooltip" onClick={this.toggleShowOrHide.bind(this)} ref="toggleShowOrHide" data-placement="top" title="Hide">
        <i className="fa fa-eye fa-2x text-primary"></i>
      </li>
    }
    if (this.props.product && this.props.product.deleted) {
      deleteOption = <li className="disabled" data-toggle="tooltip" onClick={this.toggleDeleteProduct.bind(this)} ref="deleteProduct" data-placement="top" title="Restore">
        <i className="fa fa-refresh text-danger fa-2x"></i>
      </li>
    } else {
      deleteOption = <li className="disabled" data-toggle="tooltip" onClick={this.toggleDeleteProduct.bind(this)} ref="deleteProduct" data-placement="top" title="Delete">
        <i className="fa fa-trash text-danger fa-2x"></i>
      </li>
    }
    return <div className="col-md-12">
      <ul className="list-inline text-right">
        <li data-toggle="tooltip" onClick={this.saveProduct.bind(this)} ref="saveProduct" data-placement="top" title="Save">
          <i className="fa fa-check text-success fa-2x"></i>
        </li>
        {hideOption}
        {deleteOption}
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
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let sub = Meteor.subscribe('productById', props.productId);
  let productCollectionSub = Meteor.subscribe('sgiProductCollection');
  let productTypeSub = Meteor.subscribe('productType');
  let productGenderSub = Meteor.subscribe('productGender');

  let sgiProductCollection = undefined;
  let product = ProductsCollection.findOne({ _id: props.productId });
  let productType = undefined;
  let productGender = undefined;
  let imageSub = undefined;
  let productImage = undefined;

  if (sub.ready() && !_.isUndefined(product)) {
    imageSub = Meteor.subscribe('productImagesById', product.productImageId);
    if (imageSub.ready()) {
      productImage = ProductImages.findOne({ _id: product.productImageId });
      product.image = productImage;
    }

    if (productCollectionSub.ready()) {
      sgiProductCollection = SGIProductCollection.find().fetch().map(function(collection) {
        let selected = false;
        if (product && product.collection && product.collection === collection._id) {
          selected = true;
        }
        return { value: collection._id, label: collection.name, selected: selected };
      });
    }
    if (productTypeSub.ready()) {
      productType = ProductType.find().fetch().map(function(type) {
        let selected = false;
        if (product && product.productType && product.productType === type._id) {
          selected = true;
        }
        return { value: type._id, label: type.name, selected: selected };
      })
    }
    if (productGenderSub.ready()) {
      productGender = ProductGender.find().fetch().map(function(gender) {
        let selected = false;
        if (product && product.productGender && product.productGender === gender._id) {
          selected = true;
        }
        return { value: gender._id, label: gender.name, selected: selected };
      });
    }
  }
  return {
    productLoading: !sub.ready() || !productCollectionSub.ready() || !productTypeSub.ready() || !productGenderSub.ready() || _.isUndefined(productImage),
    product: product,
    sgiProductCollection: sgiProductCollection,
    productType: productType,
    productGender: productGender
  };
}, EditProductDisplay);