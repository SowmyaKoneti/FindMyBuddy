import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

// Define the system prompt for the AI
const systemPrompt = `You are a data retrieval assistant with access to a Pinecone vector database containing user profiles. Each user profile includes a unique ID and vector embeddings that represent their areas of interest and what they are looking for.

When given an area of interest or a specific topic, your task is to:
1. Search the Pinecone vector database for user profiles with similar interests.
2. Compare the provided interest or topic with the vector embeddings of each user in the database.
3. Return a ranked list of unique IDs of users based on similarity, with the most similar users listed first.`;

// Main handler for POST requests
export async function POST(req) {
    try {
        const { input } = await req.json(); // Expecting { "input": "your interest or topic" }

        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const index = pc.index('club3-users').namespace('user-namespace');

        const openai = new OpenAI();

        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-ada-002', // Correct model name
            input: input,
        });

        const embedding = embeddingResponse.data[0]?.embedding;

        const results = await index.query({
            topK: 10, // Number of top similar results you want
            includeMetadata: false, // Not including metadata if not needed
            vector: embedding,
        });

        const ids = results.matches.map((match) => match.id);

        return NextResponse.json(ids);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
