import { db } from '../../../firebase'; // Adjust path based on your project structure
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

console.log('Connecting to Firebase database...');

// POST request to save user-details during sign-up
export async function POST(req) {
  try {
    const userDetails = await req.json();

    // Validate the required fields including the new Address field
    if (!userDetails.username || !userDetails.email || !userDetails.fullName || !userDetails.address || !userDetails.location || !userDetails.bio || !userDetails.areaOfInterest) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Extract additional fields with default empty values
    const { linkedIn = '', github = '', instagram = '', twitter = '', lookingFor = '', ...rest } = userDetails; // Include 'lookingFor' with a default empty string

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
        lookingFor, // Add the 'lookingFor' field to the update
        address: userDetails.address, // Include the address field in the update
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
        lookingFor, // Add the 'lookingFor' field to the new document
        address: userDetails.address, // Include the address field in the new document
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

// GET request to fetch user details for profile
export async function GET(req) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    // Validate required query parameters
    if (!email || !username) {
      console.log('Missing email or username in request');
      return new Response(
        JSON.stringify({ error: 'Missing email or username in request' }),
        { status: 400 }
      );
    }

    // Create a unique document ID using email and username
    const docId = `${username}_${email.replace(/[@.]/g, '_')}`; // Replacing special characters to avoid Firestore ID issues

    // Reference to the document in Firestore
    const userDocRef = doc(collection(db, 'users'), docId);

    // Fetch the document from Firestore
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      // Return the user details if the document exists
      const userData = docSnapshot.data();
      console.log(`User details fetched successfully for document ID: ${docId}`);
      return new Response(JSON.stringify(userData), { status: 200 });
    } else {
      // Return an error response if the document does not exist
      console.log(`User details not found for document ID: ${docId}`);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    // Return an error response
    return new Response(JSON.stringify({ error: 'Failed to fetch user details' }), { status: 500 });
  }
}