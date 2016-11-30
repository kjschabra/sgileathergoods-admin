import { Meteor } from 'meteor/meteor';
import { ProductsCollection, SGIProductCollection, ProductType, ProductGender } from '../imports/collections.js'

Meteor.startup(() => {
  let SGIProductCollections = ['Paris Collection', 'Eternity Collection', 'Safari Collection', 'SGI Brand'];
  let productType = ['Organizers', 'Ladies Handbags', 'Duffle Bags', 'Side Bags', 'Briefcases', 'RFID Secure Wallets', 'Accessories'];
  let productGender = ['All', 'Mens', 'Women'];

  // code to run on server at startup
  let productsLen = ProductsCollection.find().count();
  let SGIProductCollectionCount = SGIProductCollection.find().count();
  let productTypeCount = ProductType.find().count();
  let productGenderCount = ProductGender.find().count();

  if (productsLen === 0) {
    ProductsCollection.insert({
      name: "test",
      testRecord: true,
      addedOn: new Date(),
      imageUrl: "https://en.wikipedia.org/wiki/Kobe_Bryant#/media/File:Kobe_Bryant_warming_up.jpg",
      description: "Kobe Bryant aka BLACK MAMBA",
      size: "6ft 5inches",
    })
  }
  if (SGIProductCollectionCount === 0) {
    _.each(SGIProductCollections, function(collectionName) {
      SGIProductCollection.insert({
        name: collectionName,
        addedOn: new Date()
      });
    });
  }

  if (productTypeCount === 0) {
    _.each(productType, function(type) {
      ProductType.insert({
        name:type,
        addedOn: new Date()
      });
    })
  }

  if (productGenderCount === 0) {
    _.each(productGender, function(gender) {
      ProductGender.insert({
        name:gender,
        addedOn: new Date()
      })
    });
  }

});