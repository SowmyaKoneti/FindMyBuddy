import { db } from '../../../firebase'; 
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Store a private message in Firestore
export async function POST(req) {
  try {
    const { sender, receiver, message, timestamp } = await req.json();

    if (!sender || !receiver || !message || !timestamp) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const chatId = [sender, receiver].sort().join('_');

    const chatDocRef = doc(collection(db, 'chats'), chatId);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, {
        messages: [{ sender, text: message, timestamp }],
      });
    } else {
      await updateDoc(chatDocRef, {
        messages: arrayUnion({ sender, text: message, timestamp }),
      });
    }

    return new Response(JSON.stringify({ message: 'Message stored successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error storing message:', error);
    return new Response(JSON.stringify({ error: 'Failed to store message' }), { status: 500 });
  }
}

// Load private messages between two users
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get('sender');
    const receiver = searchParams.get('receiver');

    if (!sender || !receiver) {
      return new Response(JSON.stringify({ error: 'Missing sender or receiver' }), { status: 400 });
    }

    const chatId = [sender, receiver].sort().join('_');

    const chatDocRef = doc(collection(db, 'chats'), chatId);
    const chatDoc = await getDoc(chatDocRef);

    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, { messages: [] });
      return new Response(JSON.stringify({ messages: [] }), { status: 200 });
    }

    const messages = chatDoc.data().messages || [];
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error('Error loading messages:', error);
    return new Response(JSON.stringify({ error: 'Failed to load messages' }), { status: 500 });
  }
}
