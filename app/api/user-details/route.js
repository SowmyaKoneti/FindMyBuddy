import { db } from '../../../firebase'; 
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

console.log('Connecting to Firebase database...');

// POST request to save user-details during sign-up
export async function POST(req) {
  try {
    const userDetails = await req.json();

    if (!userDetails.username || !userDetails.email || !userDetails.fullName || !userDetails.address || !userDetails.location || !userDetails.bio || !userDetails.areaOfInterest) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { linkedIn = '', github = '', instagram = '', twitter = '', lookingFor = '', ...rest } = userDetails; 

    const docId = `${userDetails.username}_${userDetails.email.replace(/[@.]/g, '_')}`; 
    const userDocRef = doc(collection(db, 'users'), docId);

    const existingDoc = await getDoc(userDocRef);
    if (existingDoc.exists()) {
      await setDoc(userDocRef, {
        linkedIn,
        github,
        instagram,
        twitter,
        lookingFor, 
        address: userDetails.address, 
        ...rest,
        updatedAt: new Date().toISOString(), 
        friends: existingDoc.data().friends || [], 
      }, { merge: true }); 
      console.log(`User details updated successfully for document ID: ${docId}`);

    } else {
      await setDoc(userDocRef, {
        linkedIn,
        github,
        instagram,
        twitter,
        lookingFor, 
        address: userDetails.address, 
        ...rest,
        createdAt: new Date().toISOString(), 
        friends: [], 
      });
      console.log(`User details added successfully with document ID: ${docId}`);
    }

    return new Response(JSON.stringify({ message: 'User details saved successfully', id: docId }), { status: 201 });
  } catch (error) {
    console.error('Error adding/updating user details:', error);
    return new Response(JSON.stringify({ error: 'Failed to save user details' }), { status: 500 });
  }
}

// GET request to fetch user details for profile
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    if (email && username) {
      return await fetchUserDetails(email, username);
    } else {
      return await fetchAllUsers();
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: 'Failed to handle request' }), { status: 500 });
  }
}

// Function to fetch individual user details
async function fetchUserDetails(email, username) {
  const docId = `${username}_${email.replace(/[@.]/g, '_')}`; 
  
  const userDocRef = doc(collection(db, 'users'), docId);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
    console.log(`User details fetched successfully for document ID: ${docId}`);
    return new Response(JSON.stringify(userData), { status: 200 });
  } else {
    console.log(`User details not found for document ID: ${docId}`);
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }
}

// Function to fetch all users
async function fetchAllUsers() {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log('Fetched all users successfully');
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching all users:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch all users' }), { status: 500 });
  }
}
