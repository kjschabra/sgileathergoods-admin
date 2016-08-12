import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import FileInput from 'react-file-input';
import Swal from 'sweetalert';
import {createContainer} from 'meteor/react-meteor-data';
import {ProductImages} from '../../../imports/collections.js';
import {Random} from 'meteor/random';
import RenderForm from './render-form.jsx';
import Product from './product.jsx';
import Loading from '../components/loading.jsx';
export default class AddProductDisplay extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
    return null;
  }
  renderAddProductMenu() {
    return <ul className="list-inline text-right">
      <li onClick={this.handleFormSubmit.bind(this)} data-toggle="tooltip" data-placement="top" title="Save">
        <i className="fa fa-check text-success fa-2x"></i>
      </li>
    </ul>
  }
  handleFormSubmit(event) {
    event.preventDefault();
    let checked = false;
    let checkForErrors = [];
    let self = this;
    if (this.props.errors) {
      _.each(this.props.errors, function(val, key) {
        let errorContainerRef = key + 'Error';
        if (val.error) {
          ReactDOM.findDOMNode(self.refs[errorContainerRef]).innerHTML = val.errorDesc;
          checkForErrors.push(true);
        } else {
          ReactDOM.findDOMNode(self.refs[errorContainerRef]).innerHTML = "";
        }
      });
      if (checkForErrors.length === 0) {
        checked = true;
      }
    }
    if (checked) {
      let productName = ReactDOM.findDOMNode(this.refs.productName).value.trim();
      let productSizeLength = parseFloat(ReactDOM.findDOMNode(this.refs.productSizeLength).value.trim());
      let productSizeWidth = parseFloat(ReactDOM.findDOMNode(this.refs.productSizeWidth).value.trim());
      let productSizeVolume = parseFloat(ReactDOM.findDOMNode(this.refs.productSizeVolume).value.trim());
      let productDescription = ReactDOM.findDOMNode(this.refs.productDescription).value.trim();
      let productImages = this.props.fileAdded;
      let imageIds = [];
      let imagesUploaded = false;
      // Create a new file in the file collection to upload
      productImages.map(function(file) {
        let imageIds = [];
        ProductImages.insert(file[0], function(err, fileObj) {
          if (err) {
            console.log(err);
          }
          if (fileObj) {
            Meteor.call("addProduct", productName, productSizeLength, productSizeWidth, productSizeVolume, productDescription, fileObj._id, function(err, result) {
              if (err) {
                Swal({title: "Something went wrong", text: err.error, type: "error"});
              } else {
                Swal({
                  title: "Product added",
                  text: result,
                  type: "success",
                  function() {
                    FlowRouter.go('/admin');
                  }
                });
              }
            });
          }
        });
      });
    } else {
      let formError = ReactDOM.findDOMNode(this.refs.formError).innerHTML = "Please address all the issues first!";
    }
  }
  renderAddProductDisplayForm() {
    return <div className="row">
      <div className="col-md-10">
        <h3 className="lead text-center text-muted">Add Product</h3>
        <div className="row text-center">
          <h5>
            <span ref="formError" className="label label-danger"></span>
          </h5>
        </div>
        <form className="form-horizontal">
          <div className="form-group text-center">
            <div className="row">
              <small ref="productNameError" className="text-danger"></small>
            </div>
            <label htmlFor="productName" className="col-sm-2 control-label">Product Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="productName" ref="productName" onChange={this.checkProductName.bind(this)} placeholder="Red Handbag"/>
            </div>
          </div>
          <div className="form-group text-center">
            <div className="row">
              <div className="col-md-10 col-sm-offset-2">
                <div className="col-sm-3">
                  <small ref="productSizeLengthError" className="text-danger"></small>
                </div>
                <div className="col-sm-3">
                  <small ref="productSizeWidthError" className="text-danger"></small>
                </div>
                <div className="col-sm-3">
                  <small ref="productSizeVolumeError" className="text-danger"></small>
                </div>
              </div>
            </div>
            <label htmlFor="product-size" className="col-sm-2 control-label">Product Size</label>
            <div className="col-sm-2">
              <input type="text" className="form-control" id="productSizeLength" ref="productSizeLength" onChange={this.checkProductSize.bind(this)} placeholder="24'"/>
            </div>
            <label className="col-sm-1 control-label">X</label>
            <div className="col-sm-2">
              <input type="text" className="form-control" id="productSizeWidth" ref="productSizeWidth" onChange={this.checkProductSize.bind(this)} placeholder="10'"/>
            </div>
            <label className="col-sm-1 control-label">X</label>
            <div className="col-sm-2">
              <input type="text" className="form-control" id="productSizeVolume" ref="productSizeVolume" onChange={this.checkProductSize.bind(this)} placeholder="8'"/>
            </div>
          </div>
          <div className="form-group text-center">
            <div className="row text-center">
              <small ref="productDescriptionError" className="text-danger"></small>
            </div>
            <label htmlFor="product-description" className="col-sm-2 control-label">Product Description</label>
            <div className="col-sm-10">
              <textarea type="text" name="product-description" rows="5" className="form-control" id="productDescription" ref="productDescription" onChange={this.checkProductDescription.bind(this)} placeholder="This Handbag was designed..."></textarea>
            </div>
          </div>
          <div className="form-group">
            <div className="row text-center">
              <small ref="productImageError" className="text-danger"></small>
            </div>
            <label htmlFor="product-image" className="col-sm-2 control-label">Product Image</label>
            <div className="col-sm-10 text-center">
              <FileInput name="product-image" id="productImage" ref="productImage" accept=".png,.gif,.jpg,.jpeg" placeholder="Select an Image" className="btn btn-primary inputFileClass" onChange={this.checkProductImage.bind(this)}/>
              <small className="text-info">File Size must be smaller than
                <strong>&nbsp;2 mb</strong>
              </small>
            </div>
            <div className="row">
              <div className="col-md-12">
                {this.props.fileAdded.map(function(file) {
                  return <span className="label label-primary">{file.name}
                    &nbsp<i className="fa fa-times"></i>
                  </span>;
                })}
              </div>
            </div>
          </div>
          <div className="col-md-12">
            {this.renderAddProductMenu()}
          </div>
        </form>
      </div>
    </div>
  }
  formData(productData) {
    let formData = [
      {
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
        additionalTag: [
          {
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
          }
        ]
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
        labelValue: "Product Image",
        value: "",
        tagDivClass: "col-md-5",
        tagClass: "form-control",
        tagType: "file",
        labelClass: "col-md-2",
        tag: "input",
        placeholder: "Select an Image",
        ref: "productImage"
      }
    ];
    return formData;
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
    return <RenderForm formClass="form-horizontal" onUpdate={this.onUpdate} formData={this.formData()}/>;
  }
}
export default AddProductDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {
    errors: {
      productName: {
        error: true,
        errorDesc: globalError.empty
      },
      productSizeLength: {
        error: true,
        errorDesc: globalError.empty + globalError.join + globalError.number
      },
      productSizeWidth: {
        error: true,
        errorDesc: globalError.empty + globalError.join + globalError.number
      },
      productSizeVolume: {
        error: true,
        errorDesc: globalError.empty + globalError.join + globalError.number
      },
      productDescription: {
        error: true,
        errorDesc: globalError.empty
      },
      productImage: {
        error: true,
        errorDesc: globalError.image
      }
    },
    fileAdded: []
  };
}, AddProductDisplay);
