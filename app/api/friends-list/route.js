import { db } from '../../../firebase'; // Firestore import
import { collection, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Function to add a friend to the current user's friend list
// Input {
//   "currentUserEmail": "currentuser@example.com",
//   "currentUserUsername": "currentuser",
//   "friendEmail": "friend@example.com",
//   "friendUsername": "friend"
// }
export async function POST(req) {
  try {
    const { currentUserEmail, currentUserUsername, friendEmail, friendUsername } = await req.json();

    // Construct the document IDs for both users
    const currentUserDocId = `${currentUserUsername}_${currentUserEmail.replace(/[@.]/g, '_')}`;
    const friendDocId = `${friendUsername}_${friendEmail.replace(/[@.]/g, '_')}`;

    // Reference to the current user's document in Firestore
    const currentUserDocRef = doc(collection(db, 'users'), currentUserDocId);

    // Fetch the current user's document
    const currentUserDoc = await getDoc(currentUserDocRef);

    if (!currentUserDoc.exists()) {
      return new Response(JSON.stringify({ error: 'Current user not found' }), { status: 404 });
    }

    // Update the current user's friends list with the friend's document ID
    await updateDoc(currentUserDocRef, {
      friends: arrayUnion(friendDocId),
    });

    return new Response(JSON.stringify({ message: 'Friend added successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error adding friend:', error);
    return new Response(JSON.stringify({ error: 'Failed to add friend' }), { status: 500 });
  }
}

// GET request to fetch all friends of the current user
// Input: GET /api/friends-list?email=currentuser@example.com&username=currentusername
export async function GET(req) {
  try {
    // Extract the current user's email and username from the query parameters
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');
    const userUsername = searchParams.get('username');

    // Validate that both email and username are provided
    if (!userEmail || !userUsername) {
      return new Response(JSON.stringify({ error: 'Missing email or username parameter' }), { status: 400 });
    }

    // Construct the current user's document ID using username and email
    const userDocId = `${userUsername}_${userEmail.replace(/[@.]/g, '_')}`;

    // Reference the user's document in Firestore
    const userDocRef = doc(collection(db, 'users'), userDocId);

    // Fetch the user's document from Firestore
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Return an error if the user's document does not exist
      console.log(`User not found for document ID: ${userDocId}`);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Retrieve the friends list from the user's document
    const userData = userDoc.data();
    const friendsList = userData.friends || []; // Default to an empty array if friends field is missing

    // Fetch details for each friend using their document IDs
    const friendsDetails = await Promise.all(
      friendsList.map(async (friendDocId) => {
        const friendDocRef = doc(collection(db, 'users'), friendDocId);
        const friendDoc = await getDoc(friendDocRef);
        return friendDoc.exists() ? { id: friendDocId, ...friendDoc.data() } : null;
      })
    );

    // Filter out any null values (friends that were not found)
    const validFriendsDetails = friendsDetails.filter(friend => friend !== null);

    // Return the friends' details in the response
    return new Response(JSON.stringify(validFriendsDetails), { status: 200 });
  } catch (error) {
    console.error('Error fetching friends list:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch friends list' }), { status: 500 });
  }
}

// DELETE request to remove a friend from the current user's friend list
// Input {
//   "currentUserEmail": "currentuser@example.com",
//   "currentUserUsername": "currentuser",
//   "friendEmail": "friend@example.com",
//   "friendUsername": "friend"
// }
export async function DELETE(req) {
  try {
    const { currentUserEmail, currentUserUsername, friendEmail, friendUsername } = await req.json();

    // Construct the document IDs for both users
    const currentUserDocId = `${currentUserUsername}_${currentUserEmail.replace(/[@.]/g, '_')}`;
    const friendDocId = `${friendUsername}_${friendEmail.replace(/[@.]/g, '_')}`;

    // Reference to the current user's document in Firestore
    const currentUserDocRef = doc(collection(db, 'users'), currentUserDocId);

    // Fetch the current user's document
    const currentUserDoc = await getDoc(currentUserDocRef);

    if (!currentUserDoc.exists()) {
      return new Response(JSON.stringify({ error: 'Current user not found' }), { status: 404 });
    }

    // Remove the friend's document ID from the current user's friends list
    await updateDoc(currentUserDocRef, {
      friends: arrayRemove(friendDocId),
    });

    return new Response(JSON.stringify({ message: 'Friend removed successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error removing friend:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove friend' }), { status: 500 });
  }
}
