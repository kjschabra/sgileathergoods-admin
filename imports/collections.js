import { Mongo } from 'meteor/mongo';
// import { FS, Store } from 'meteor/cfs:standard-packages';
// import { GridFS } from 'meteor/cfs:gridfs';

var imageStore = new FS.Store.GridFS("images", {
  maxTries: 1, // optional, default 5
  chunkSize: 1024*1024  // optional, default GridFS chunk size in bytes (can be overridden per file).
                        // Default: 2MB. Reasonable range: 512KB - 4MB
});

export const ProductsCollection = new Mongo.Collection('products');
export const ProductImages = new FS.Collection("productImages", {
  stores: [imageStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});
