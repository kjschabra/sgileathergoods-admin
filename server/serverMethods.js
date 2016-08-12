import {Mongo} from 'meteor/mongo';
import {ProductsCollection, ProductImages} from '../imports/collections.js';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

Meteor.methods({
  addProduct(name, length, width, volume, description, imageId) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(name, String);
    check(length, Number);
    check(width, Number);
    check(volume, Number);
    check(description, String);
    check(imageId, String);
    let processed = true;
    let error = '';
    try {
      ProductsCollection.insert({
        name: name,
        length: length,
        width: width,
        volume: volume,
        description: description,
        imageIds: imageId,
        addedOn: new Date()
      });
    } catch (e) {
      processed = false;
      error = new Meteor.Error('errorInsertingProduct', e);
    }
    if (processed) {
      return "Product has been added to a list of collection"
    } else {
      return error;
    }
  },
  updateProduct(productId, name, length, width, volume, description, imageId) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(productId, String);
    check(name, String);
    check(length, Number);
    check(width, Number);
    check(volume, Number);
    check(description, String);
    check(imageId, String);
    let processed = true;
    let error = '';
    try {
      ProductsCollection.insert({
        name: name,
        length: length,
        width: width,
        volume: volume,
        description: description,
        imageIds: imageId,
        addedOn: new Date()
      });
    } catch (e) {
      processed = false;
      error = new Meteor.Error('errorInsertingProduct', e);
    }
    if (processed) {
      return "Product has been added to a list of collection"
    } else {
      return error;
    }
  },
  deleteProduct(productId) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(productId, String);
    let updated = true;
    let error = "";
    try {
      ProductsCollection.update({
        _id: productId
      }, {
        $set: {
          deleted: true
        }
      });
    } catch (e) {
      updated = false;
      error = new Meteor.Error("errorDeletingProduct", e);
    }
    if (updated) {
      return "Selected product was deleted."
    } else {
      return error;
    }
  },
  toggleShowOrHide(productId) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(productId, String);
    let updated = true;
    let error = "";
    let product = ProductsCollection.findOne({_id: productId});
    try {
      ProductsCollection.update({
        _id: productId
      }, {
        $set: {
          hidden: (!product.hidden || true)
        }
      });
    } catch (e) {
      updated = false;
      error = new Meteor.Error("errorDeletingProduct", e);
    }
    if (updated) {
      return "Selected product was deleted."
    } else {
      return error;
    }
  }
});
