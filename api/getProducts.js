const admin = require('firebase-admin');

// Securely initialize Firebase Admin using an environment variable
// (Set this in your Vercel project settings)
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

const db = admin.firestore();

// This function handles requests to yourdomain.com/api/getProducts
export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Set caching headers for performance
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    
    // Send the products list back to the frontend
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}