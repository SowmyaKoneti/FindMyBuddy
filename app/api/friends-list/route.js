import { db } from '../../../firebase'; 
import { collection, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

// Function to add a friend to the current user's friend list
export async function POST(req) {
  try {
    const { currentUserEmail, currentUserUsername, friendEmail, friendUsername } = await req.json();

    const currentUserDocId = `${currentUserUsername}_${currentUserEmail.replace(/[@.]/g, '_')}`;
    const friendDocId = `${friendUsername}_${friendEmail.replace(/[@.]/g, '_')}`;

    const currentUserDocRef = doc(collection(db, 'users'), currentUserDocId);
    const currentUserDoc = await getDoc(currentUserDocRef);

    if (!currentUserDoc.exists()) {
      return new Response(JSON.stringify({ error: 'Current user not found' }), { status: 404 });
    }
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
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');
    const userUsername = searchParams.get('username');

    if (!userEmail || !userUsername) {
      return new Response(JSON.stringify({ error: 'Missing email or username parameter' }), { status: 400 });
    }

    const userDocId = `${userUsername}_${userEmail.replace(/[@.]/g, '_')}`;

    const userDocRef = doc(collection(db, 'users'), userDocId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log(`User not found for document ID: ${userDocId}`);
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    const userData = userDoc.data();
    const friendsList = userData.friends || []; 

    // Fetch details for each friend using their document IDs
    const friendsDetails = await Promise.all(
      friendsList.map(async (friendDocId) => {
        const friendDocRef = doc(collection(db, 'users'), friendDocId);
        const friendDoc = await getDoc(friendDocRef);
        return friendDoc.exists() ? { id: friendDocId, ...friendDoc.data() } : null;
      })
    );
    const validFriendsDetails = friendsDetails.filter(friend => friend !== null);

    return new Response(JSON.stringify(validFriendsDetails), { status: 200 });
  } catch (error) {
    console.error('Error fetching friends list:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch friends list' }), { status: 500 });
  }
}

// DELETE request to remove a friend from the current user's friend list
export async function DELETE(req) {
  try {
    const { currentUserEmail, currentUserUsername, friendEmail, friendUsername } = await req.json();

    const currentUserDocId = `${currentUserUsername}_${currentUserEmail.replace(/[@.]/g, '_')}`;
    const friendDocId = `${friendUsername}_${friendEmail.replace(/[@.]/g, '_')}`;

    const currentUserDocRef = doc(collection(db, 'users'), currentUserDocId);
    const currentUserDoc = await getDoc(currentUserDocRef);

    if (!currentUserDoc.exists()) {
      return new Response(JSON.stringify({ error: 'Current user not found' }), { status: 404 });
    }
    await updateDoc(currentUserDocRef, {
      friends: arrayRemove(friendDocId),
    });

    return new Response(JSON.stringify({ message: 'Friend removed successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error removing friend:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove friend' }), { status: 500 });
  }
}
