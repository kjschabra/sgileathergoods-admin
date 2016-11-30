import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FileInput from 'react-file-input';
import Swal from 'sweetalert';
import { createContainer } from 'meteor/react-meteor-data';
import { ProductImages, SGIProductCollection, ProductType, ProductGender } from '../../../imports/collections.js';
import { Random } from 'meteor/random';
import { RenderForm } from './render-form.jsx';
import { Product } from './product.jsx';
import Loading from '../components/loading.jsx';

export class AddProductDisplay extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
    return null;
  }
  formData(productData) {
    let self = this;
    let formData = [{
      labelValue: "Product Name",
      value: "",
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
        value: "",
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
        value: "",
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
        value: "",
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
      value: "",
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
      value: "",
      tagDivClass: "col-md-10",
      tagClass: "form-control",
      tagType: "text",
      tag: "input",
      tagType: "text",
      placeholder: "$130 CAD",
      errors: ["empty"],
      ref: "productPrice"
    }, {
      labelValue: "Product Description",
      value: "",
      tagDivClass: "col-md-10",
      tagClass: "form-control",
      tagType: "text",
      labelClass: "col-md-2",
      tag: "textarea",
      placeholder: "This handbag can carry...",
      errors: ["empty"],
      ref: "productDescription"
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
      labelValue: "Product Image",
      value: "",
      tagDivClass: "col-md-5",
      tagClass: "form-control",
      tagType: "file",
      labelClass: "col-md-2",
      tag: "input",
      placeholder: "Select an Image",
      errors: ["image"],
      ref: "productImage",
    }];
    return formData;
  }
  handleFormSubmit() {
    event.preventDefault();
    let hasErrors = false;
    let formData = this.formData(this.props.product);
    let formValues = [];
    let additionalTags = [];
    formData.map(function(formGet, k) {
      let err = {};
      if (formGet && formGet.additionalTag && formGet.additionalTag.length > 0) {
        formGet.additionalTag.map(function(tag, i) {
          if ((tag.tag === "input" || tag.tag === "textarea") && tag.errors) {
            let additionErr = {};
            let elemValue = document.getElementsByName(tag.ref)[0].value.trim();
            additionErr.message = SGI.globalInputErrors(elemValue, tag.errors);
            additionErr.tag = tag.ref;
            if (tag.tagType !== "file") {
              additionErr.value = elemValue;
            } else {
              additionErr.value = document.getElementsByName(tag.ref)[0].files;
            }
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
          if (formGet.tagType !== "file") {
            err.value = elemValue;
          } else {
            err.value = document.getElementsByName(formGet.ref)[0].files;
          }
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
      let productImage = _.where(formValues, { tag: "productImage" });
      let imageUpload = ProductImages.insert(productImage[0].value[0], function(err, fileObj) {
        if (err) {
          console.log(err);
          Swal("Error", err, "error");
        }
        if (fileObj) {
          let productImage = [{ tag: "productImageId", value: fileObj._id }];
          formValues = _.union(formValues, productImage);

          Meteor.call("addProduct", formValues, function(err, result) {
            if (err) {
              Swal("Error!", err, "error");
            }
            if (result) {
              Swal({
                title: "Updated!",
                text: result,
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#0066d9",
                confirmButtonText: "OK!",
                closeOnConfirm: true,
              }, function() {
                FlowRouter.go('/admin');
              });

            }
          });
        }
      });
    }
  }
  renderAddProductMenu() {
    return <ul className="list-inline text-right">
      <li onClick={this.handleFormSubmit.bind(this)} data-toggle="tooltip" data-placement="top" title="Save">
        <i className="fa fa-check text-success fa-2x"></i>
      </li>
    </ul>
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
  render() {
    var renderForm = undefined;
    if (this.props.loading) {
      renderForm = <Loading />
    } else {
      renderForm = <RenderForm formClass="form-horizontal" onUpdate={this.onUpdate} formData={this.formData()}/>
    }

    return <div className="row">
      <h3 className="text-center lead text-muted">Add Product</h3>
      {this.renderAddProductMenu()}
      {renderForm}
    </div>
  }
}
export default AddProductDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let productCollectionSub = Meteor.subscribe('sgiProductCollection');
  let productTypeSub = Meteor.subscribe('productType');
  let productGenderSub = Meteor.subscribe('productGender');
  let sgiProductCollection = undefined;
  let productType = undefined;
  let productGender = undefined;
  if (productCollectionSub.ready()) {
    sgiProductCollection = SGIProductCollection.find().fetch().map(function(collection) {
      return { value: collection._id, label: collection.name, selected: false };
    });
  }
  if (productTypeSub.ready()) {
    productType = ProductType.find().fetch().map(function(type) {
      return { value: type._id, label: type.name, selected: false };
    })
  }
  if (productGenderSub.ready()) {
    productGender = ProductGender.find().fetch().map(function(gender) {
      return { value: gender._id, label: gender.name, selected: false };
    });
  }
  return {
    loading: !productCollectionSub.ready() || !productTypeSub.ready() || !productGenderSub.ready() || false,
    sgiProductCollection: sgiProductCollection,
    productType: productType,
    productGender: productGender
  };
}, AddProductDisplay);