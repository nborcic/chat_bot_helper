

export async function POST({ request }) {
    const { message } = await request.json();

    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
        {
            headers: { Authorization: "HUGGINGFACE_API_KEY" },
            method: "POST",
            body: JSON.stringify({ inputs: message }),
        }
    );

    const text = await response.text();
    console.log("Hugging Face Response:", text);

    try {
        const data = JSON.parse(text);
        console.log("dataa", data);

        return new Response(JSON.stringify({ reply: data[0]?.generated_text || "I don't know." }));
    } catch (error) {
        return new Response(JSON.stringify({ reply: "Error processing response from API." }));
    }
}
