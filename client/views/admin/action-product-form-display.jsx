import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import FileInput from 'react-file-input';
import Swal from 'sweetalert';
import {createContainer} from 'meteor/react-meteor-data';
import {ProductImages} from '../../../imports/collections.js';
import {Random} from 'meteor/random';
import Product from './product.jsx';
import Loading from '../components/loading.jsx';
export default class ProductFormDisplay extends React.Component {
  componentDidMount() {
    return null;
  }
  renderSubmit() {
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
  }
  checkProductName(event) {
    event.preventDefault();
    let text = event.target.value.trim();
    let elementId = event.target.id;
    let errorRef = elementId + "Error";
    if (!text || _.isEmpty(text)) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = globalError.empty;
      this.props.errors[elementId].error = true;
    } else if (text && text.length < 3) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = "This field must have a minimum of 3 characters";
      this.props.errors[elementId].error = true;
    } else {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = "";
      this.props.errors[elementId].error = false;
      this.props.errors[elementId].val = text;
    }
  }
  checkProductSize(event) {
    event.preventDefault();
    let text = event.target.value.trim();
    let elementId = event.target.id;
    let errorRef = elementId + "Error";
    if (!text || _.isEmpty(text)) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = globalError.empty;
      this.props.errors[elementId].error = true;
    } else if (isNaN(text)) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = globalError.number;
      this.props.errors[elementId].error = true;
    } else {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = "";
      this.props.errors[elementId].error = false;
    }
  }
  checkProductDescription(event) {
    event.preventDefault();
    let text = event.target.value.trim();
    let elementId = event.target.id;
    let errorRef = elementId + "Error";
    if (!text || _.isEmpty(text)) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = globalError.empty;
      this.props.errors[elementId].error = true;
    } else if (text && text.length < 3) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = "This field must have a minimum of 3 characters";
      this.props.errors[elementId].error = true;
    } else {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = "";
      this.props.errors[elementId].error = false;
    }
  }
  checkProductImage(event) {
    event.preventDefault();
    let file = event.target.files;
    let elementId = "productImage";
    let errorRef = elementId + "Error";
    if (file.length < 1 || _.isUndefined(file)) {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = globalError.image;
      this.props.errors[elementId].error = true;
    } else {
      ReactDOM.findDOMNode(this.refs[errorRef]).innerHTML = "";
      this.props.errors[elementId].error = false;
      this.props.fileAdded.push(file);
    }
  }
  checkAndRenderProductImage() {
    if (this.props.imageLoading) {
      return <Loading/>
    } else {
      if (this.props.image && !_.isUndefined(this.props.image)) {
        return <img src={this.props.image.url(store = "images")} className="img-responsive thumbnail" width="500"/>;
      } else {
        return <img src="" className="img-responsive thumbnail" width="500" />
      }
    }
  }
  renderAddProductDisplayForm() {
    return <form className="form-horizontal">
      <div className="form-group text-center">
        <div className="row">
          <small ref="productNameError" className="text-danger"></small>
        </div>
        <label htmlFor="productName" className="col-sm-2 control-label">Product Name</label>
        <div className="col-sm-10">
          <input type="text" className="form-control" id="productName" ref="productName" defaultValue={this.props.inputValues.name} onChange={this.props.save} placeholder="Red Handbag"/>
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
          <input type="text" className="form-control" id="productSizeLength" ref="productSizeLength" defaultValue={this.props.inputValues.length} onChange={this.checkProductSize.bind(this)} placeholder="24'"/>
        </div>
        <label className="col-sm-1 control-label">X</label>
        <div className="col-sm-2">
          <input type="text" className="form-control" id="productSizeWidth" ref="productSizeWidth" defaultValue={this.props.inputValues.width} onChange={this.checkProductSize.bind(this)} placeholder="10'"/>
        </div>
        <label className="col-sm-1 control-label">X</label>
        <div className="col-sm-2">
          <input type="text" className="form-control" id="productSizeVolume" ref="productSizeVolume" defaultValue={this.props.inputValues.volume} onChange={this.checkProductSize.bind(this)} placeholder="8'"/>
        </div>
      </div>
      <div className="form-group text-center">
        <div className="row text-center">
          <small ref="productDescriptionError" className="text-danger"></small>
        </div>
        <label htmlFor="product-description" className="col-sm-2 control-label">Product Description</label>
        <div className="col-sm-10">
          <textarea type="text" name="product-description" rows="5" className="form-control" id="productDescription" ref="productDescription" defaultValue={this.props.inputValues.description} onChange={this.checkProductDescription.bind(this)} placeholder="This Handbag was designed..."></textarea>
        </div>
      </div>
      <div className="form-group">
        <div className="row text-center">
          <small ref="productImageError" className="text-danger"></small>
        </div>
        <label htmlFor="product-image" className="col-sm-2 control-label">Product Image</label>
        <div className="col-md-6">
          {this.checkAndRenderProductImage()}
        </div>
        <div className="col-sm-4 text-center">
          <FileInput name="product-image" id="productImage" ref="productImage" accept=".png,.gif,.jpg,.jpeg" placeholder="Select an Image" className="btn btn-primary inputFileClass" onChange={this.checkProductImage.bind(this)}/>
          <small className="text-info">File Size must be smaller than
            <strong>&nbsp;2 mb</strong>
          </small>
        </div>
      </div>
    </form>
  }
  render() {
    return this.renderAddProductDisplayForm();
  }
}
let globalError = {
  empty: "This field can't be left empty",
  number: "This field must be a number",
  image: "Please select an image to upload",
  join: " and "
}
export default ProductFormDisplay = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let sub,
    image;
  if (props.data.imageIds && !_.isEmpty(props.data.imageIds)) {
    sub = Meteor.subscribe("productImagesById", props.data.imageIds);
    image = ProductImages.findOne({_id: props.data.imageIds});
  }
  return {
    errors: {
      productName: {
        error: true,
        val:"",
        errorDesc: globalError.empty
      },
      productSizeLength: {
        error: true,
        val:"",
        errorDesc: globalError.empty + globalError.join + globalError.number
      },
      productSizeWidth: {
        error: true,
        val:"",
        errorDesc: globalError.empty + globalError.join + globalError.number
      },
      productSizeVolume: {
        error: true,
        val:"",
        errorDesc: globalError.empty + globalError.join + globalError.number
      },
      productDescription: {
        error: true,
        val:"",
        errorDesc: globalError.empty
      },
      productImage: {
        error: true,
        val:"",
        errorDesc: globalError.image
      }
    },
    fileAdded: [],
    inputValues: {
      name: (props.data.name || ""),
      length: (props.data.length || ""),
      width: (props.data.width || ""),
      volume: (props.data.volume || ""),
      description: (props.data.description || ""),
      image: (props.data.imageIds || "")
    },
    imageLoading: (!sub.ready() || false),
    image: (image || "")
  };
}, ProductFormDisplay);
