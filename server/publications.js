import { ProductsCollection, ProductImages, SGIProductCollection, ProductType, ProductGender } from '../imports/collections.js'
import { Meteor } from 'meteor/meteor';
import { Mongo, Collection } from 'meteor/mongo';


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('productsCollection', function() {
    if (this.userId)
      return ProductsCollection.find({ deleted: false, hidden: false }, { sort: { addedOn: -1 } });
    else
      return null;
  });
  Meteor.publish('productById', function(productId) {
    if (this.userId) {
      return ProductsCollection.find({ _id: productId });
    } else {
      return null;
    }
  });
  Meteor.publish('deletedProductsCollection', function() {
    if (this.userId) {
      return ProductsCollection.find({ deleted: true, hidden: false }, { sort: { addedOn: -1 } });
    } else {
      return null;
    }
  });
  Meteor.publish('hiddenProductsCollection', function() {
    if (this.userId) {
      return ProductsCollection.find({ deleted: false, hidden: true }, { sort: { addedOn: -1 } });
    } else {
      return null;
    }
  });
  Meteor.publish('productImages', function() {
    if (this.userId) {
      return ProductImages.find({
        'metadata._Resumable': {
          $exists: false
        }
      });
    } else {
      return null;
    }
  });
  Meteor.publish('productImagesById', function(imageId) {
    if (this.userId)
      return ProductImages.find({ _id: imageId });
    else
      return null;
  });
  Meteor.publish('sgiProductCollection', function() {
    return SGIProductCollection.find();
  });
  Meteor.publish('productType', function() {
    return ProductType.find();
  });
  Meteor.publish('productGender', function() {
    return ProductGender.find();
  });
  Meteor.publish('countOfProducts', function() {
    Counts.publish(this, 'numberOfProducts', ProductsCollection.find({ hidden: false, deleted: false }));
  });

}
ProductsCollection.allow({
  insert: function(userId) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  update: function(userId) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  remove: function(userId) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  }
});
ProductImages.allow({
  insert: function(userId, file) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  update: function(userId, file) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  remove: function(userId, file) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  download: function() {
    return true;
  }
});