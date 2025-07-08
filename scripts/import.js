// This script uploads products using the 'model' field as the unique document ID
// to prevent creating duplicates.

const admin = require('firebase-admin');
const serviceAccount = require('./grand-ac-ca90f-firebase-adminsdk-fbsvc-3dbb68d83f.json');
const productsData = require('./products.json');

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const productsCollection = db.collection('products');

async function uploadProducts() {
  console.log('Starting product upload/update...');
  
  for (const product of productsData) {
    // A 'model' field is required to act as the unique ID
    if (!product.model) {
      console.error('Skipping product without a model number:', product.name);
      continue; // Skip this product if it has no model
    }
    
    try {
      // Use the model number as the document ID and .set() the data
      await productsCollection.doc(product.model).set(product);
      console.log(`Successfully processed product: ${product.name}`);
    } catch (error) {
      console.error(`Error processing product: ${product.name}`, error);
    }
  }
  
  console.log('Product processing finished.');
}

uploadProducts();