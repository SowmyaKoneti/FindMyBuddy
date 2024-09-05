// // api/clerk-delete-user/route.js
// import { Clerk } from '@clerk/backend';

// export default async function handler(req, res) {
//   if (req.method === 'DELETE') {
//     const { username } = req.query; // Extract the username from the request query

//     if (!username) {
//       return res.status(400).json({ error: 'Username is required' });
//     }

//     try {
//       // Initialize the Clerk client with the secret key
//       const clerk = new Clerk({
//         secretKey: process.env.CLERK_SECRET_KEY,
//       });

//       // Fetch the list of users with the matching username
//       const users = await clerk.users.getUserList({
//         username: [username], // Assuming username is unique
//       });

//       if (users.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Assume the first user is the correct one since usernames should be unique
//       const user = users[0];

//       // Delete the user using their ID
//       await await clerkClient.users.deleteUser(user.id);

//       res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       res.status(500).json({ error: 'Failed to delete user' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }
