import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {ProductImages} from '../../../imports/collections.js';
import Loading from '../components/loading.jsx';
export default class Products extends React.Component {
  componentDidMount() {
    return null;
  }
  displayImage() {
    if (this.props.imageLoading) {
      return <Loading/>;
    } else {
      return <img src={this.props.image.url(store = "images")} alt="" className="img-responsive" width="250"/>;
    }
  }
  displayLabel() {
    if (this.props.data) {
      let length,
        width,
        volume;
      if (this.props.data.length) {
        length = this.props.data.length;
      }
      if (this.props.data.width) {
        width = this.props.data.width;
      }
      if (this.props.data.volume) {
        volume = this.props.data.volume
      }
      return <h5 className="text-center">
        <span className="label label-primary text-center">{length + "in x " + width + "in x " + volume + "in"}</span>
      </h5>;
    }
  }
  renderEditMenu() {
    return <div className="row text-right text-info">
      <ul className="list-inline">
        <li>
          <a href={'admin/edit-product/' + this.props.data._id}>
            <span className="label label-info">
              <i className="fa fa-pencil"></i>
            </span>
          </a>
        </li>
        <li>
          <a href="#">
            <span className="label label-danger">
              <i className="fa fa-trash"></i>
            </span>
          </a>
        </li>
      </ul>
    </div>
  }
  render() {
    return <div className="col-md-3">
      {this.renderEditMenu()}
      <div className="thumbnail">
        {this.displayImage()}
        <div className="caption">
          <h3>{this.props.data.name}</h3>
          {this.displayLabel()}
          <p>{this.props.data.description}</p>
        </div>
      </div>
    </div>
  }
}
// Products.propTypes = {
//
// }
export default Products = createContainer(props => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  let imageIds = props.data.imageIds,
    productImages = {
      loading: true,
      data: []
    };
  let sub = Meteor.subscribe('productImagesById', imageIds);
  let data = ProductImages.findOne({_id: imageIds});
  return {
    imageLoading: !sub.ready(),
    image: data
  };
}, Products);
