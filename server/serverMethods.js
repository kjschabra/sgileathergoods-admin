import { Mongo } from 'meteor/mongo';
import { ProductsCollection, ProductImages } from '../imports/collections.js';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  addProduct(formValues) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(formValues, Array);

    let processed = true;
    let error;
    let product = {
      hidden: false,
      deleted: false,
      addedOn: new Date(),
    };

    formValues.map(function(values) {
      if (values && values.tag && values.value && !_.isUndefined(values.tag) && !_.isEmpty(values) && !_.isArray(values.value) && !_.isObject(values.value) ) {
        product[values.tag] = values.value;
      }
    });
    try {
      ProductsCollection.insert(product);
    } catch (e) {
      processed = false;
      error = e;
    }
    if (processed) {
      return "Product added to the collection";
    } else {
      return new Meteor.Error("errorInsertingProduct", error);
    }
  },
  updateProduct(productId, formValues) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(productId, String);
    check(formValues, Array);

    let processed = true;
    let error;
    let product = {};
    formValues.map(function(values) {
      if (values && !_.isUndefined(values.tag) && _.isString(values.value)) {
        product[values.tag] = values.value;
      }
    });
    try {
      ProductsCollection.update({
        _id: productId
      }, { $set: product });
    } catch (e) {
      console.log("errorUpdatingProduct", e);
      processed = false;
      error = e;
    }
    if (processed) {
      return "Product has been updated";
    } else {
      return new Meteor.Error("errorInsertingProduct", error);
    }
  },
  toggleDeleteProduct(productId) {
    if (!this.userId) {
      throw new Meteor.error('Not-logged-in', "Please login!");
    }
    check(productId, String);
    let updated = true;
    let error = "";
    let product = ProductsCollection.findOne({ _id: productId });
    if (!product.deleted) {
      product.deleted = false;
    }
    try {
      ProductsCollection.update({
        _id: productId
      }, {
        $set: {
          deleted: !product.deleted
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
    let product = ProductsCollection.findOne({ _id: productId });
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