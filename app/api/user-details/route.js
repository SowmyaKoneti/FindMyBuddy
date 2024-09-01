// api/user-details/route.js
import { db } from '../../../firebase'; // Adjust path based on your project structure
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

console.log('Connecting to Firebase database...');

// Define the handler for POST requests
export async function POST(req) {
  try {
    const userDetails = await req.json();

    // Validate the required fields
    if (!userDetails.username || !userDetails.email || !userDetails.fullName || !userDetails.location || !userDetails.bio || !userDetails.areaOfInterest) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Extract additional fields with default empty values
    const { linkedIn = '', github = '', instagram = '', twitter = '', ...rest } = userDetails;

    // Create a unique document ID using email and username
    const docId = `${userDetails.username}_${userDetails.email.replace(/[@.]/g, '_')}`; // Replacing special characters to avoid Firestore ID issues

    // Reference to the document in Firestore
    const userDocRef = doc(collection(db, 'users'), docId);

    // Check if the document already exists
    const existingDoc = await getDoc(userDocRef);

    if (existingDoc.exists()) {
      // If the user already exists, update the fields
      console.log('User already exists, updating document...');

      await setDoc(userDocRef, {
        linkedIn,
        github,
        instagram,
        twitter,
        ...rest,
        updatedAt: new Date().toISOString(), // Timestamp for last update
      }, { merge: true }); // Merge with existing data

      console.log(`User details updated successfully for document ID: ${docId}`);
    } else {
      // If the user does not exist, create a new document
      console.log('Adding new user details to Firestore...');

      await setDoc(userDocRef, {
        linkedIn,
        github,
        instagram,
        twitter,
        ...rest,
        createdAt: new Date().toISOString(), // Timestamp for creation
      });

      console.log(`User details added successfully with document ID: ${docId}`);
    }

    // Return a successful response
    return new Response(JSON.stringify({ message: 'User details saved successfully', id: docId }), { status: 201 });
  } catch (error) {
    console.error('Error adding/updating user details:', error);
    // Return an error response
    return new Response(JSON.stringify({ error: 'Failed to save user details' }), { status: 500 });
  }
}
