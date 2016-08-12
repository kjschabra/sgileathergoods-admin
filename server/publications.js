import { ProductsCollection, ProductImages } from '../imports/collections.js'
import { Meteor } from 'meteor/meteor';
import { Mongo, Collection } from 'meteor/mongo';


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('productsCollection', function() {
    if (this.userId)
      return ProductsCollection.find({}, {sort:{addedOn:-1 } } );
    else
      return null;
    }
  );
  Meteor.publish('productById', function(productId) {
    if (this.userId)
      return ProductsCollection.find({_id: productId});
    else
      return null;
    }
  );
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
      return ProductImages.find({_id: imageId } );
    else
      return null;
    }
  )
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
  download:function(){
    return true;
  }
});
