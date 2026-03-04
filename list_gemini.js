const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    try {
        // Unfortunately standard JS SDK doesn't always expose listModels directly. 
        // Let's call the REST API instead to be sure.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error('Error fetching list:', err);
    }
}
main();
