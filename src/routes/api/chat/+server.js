import { HUGGINGFACE_API_KEY } from '$env/static/private';
import { HfInference } from "@huggingface/inference";
import fs from "fs";
import path from "path"

export async function POST({ request }) {
    const { message } = await request.json();
    if (!message) {
        return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }
    try {
        const client = new HfInference(HUGGINGFACE_API_KEY)
        const chatCompletion = await client.chatCompletion({
            model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            messages: [

                { role: "user", content: message }
            ],
            temperature: 0.5,
            max_tokens: 512,
            top_p: 0.7
        });
        const res = chatCompletion.choices[0].message.content;
        const filePath = path.resolve('src/lib/savedMessages.json');
        const existingMessages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const newMessages = [
            { sender: 'user', text: message },
            { sender: 'system', text: res }
        ];
        existingMessages.push(...newMessages);
        fs.writeFileSync(filePath, JSON.stringify(existingMessages, null, 2));
        return new Response(JSON.stringify({ messages: res || "I don't know." }));
    } catch (error) {
        console.error("Fetch error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch response from API" }), { status: 500 });
    }
}