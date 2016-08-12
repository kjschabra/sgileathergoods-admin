import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
export default class EditProduct extends React.Component {
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
    return null;
  }
  render() {
    return <div className="col-md-12">
      <h3 className="text-center">{this.props.data.name}</h3>
      <img src={this.props.data.imageUrl} className="img-thumbnail img-responsive"/>
      <label className="label label-info">{this.props.data.size}</label>
      <p>{this.props.data.description}</p>
    </div>
  }
}
// Products.propTypes = {
//
// }
// export default Products = createContainer(props => {
//   // props here will have `main`, passed from the router
//   // anything we return from this function will be *added* to it
//   return {
//     name:
//   };
// }, ProductsDisplay);
