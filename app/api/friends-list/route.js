import { db } from '../../../firebase'; // Firestore import
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

let friendsCache = {}; // In-memory object to store friends lists

// Function to fetch friends list from Firestore and update the cache
const updateFriendsCache = async (username) => {
  try {
    const userDocRef = doc(collection(db, 'user-friends'), username);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      friendsCache[username] = userDoc.data().friends || [];
    } else {
      friendsCache[username] = [];
    }
  } catch (error) {
    console.error('Error updating friends cache:', error);
  }
};

// API handler
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Missing username parameter' }), { status: 400 });
  }

  // Check if friends list is already cached
  if (!friendsCache[username]) {
    await updateFriendsCache(username); // Load friends list from database if not cached
  }

  return new Response(JSON.stringify({ friends: friendsCache[username] || [] }), { status: 200 });
}

export async function POST(req) {
  try {
    const { currentUser, friendUsername } = await req.json();

    // Update Firestore
    const userDocRef = doc(collection(db, 'user-friends'), currentUser);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, { friends: [friendUsername] });
    } else {
      const currentFriends = userDoc.data().friends || [];
      if (!currentFriends.includes(friendUsername)) {
        await updateDoc(userDocRef, { friends: arrayUnion(friendUsername) });
      }
    }

    // Update cache
    if (!friendsCache[currentUser]) {
      friendsCache[currentUser] = [];
    }
    if (!friendsCache[currentUser].includes(friendUsername)) {
      friendsCache[currentUser].push(friendUsername);
    }

    return new Response(JSON.stringify({ message: 'Friend added successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error adding friend:', error);
    return new Response(JSON.stringify({ error: 'Failed to add friend' }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { currentUser, friendUsername } = await req.json();

    // Update Firestore
    const userDocRef = doc(collection(db, 'user-friends'), currentUser);
    await updateDoc(userDocRef, { friends: arrayRemove(friendUsername) });

    // Update cache
    if (friendsCache[currentUser]) {
      friendsCache[currentUser] = friendsCache[currentUser].filter(friend => friend !== friendUsername);
    }

    return new Response(JSON.stringify({ message: 'Friend removed successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error removing friend:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove friend' }), { status: 500 });
  }
}
