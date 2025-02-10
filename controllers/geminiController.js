import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const geminiController = async (req, res) => {
    const description = req.body.description;

    try {
        // Extract row and column numbers from the description
        const rowMatch = description.match(/row (\d+)/i);
        const colMatch = description.match(/column (\d+)/i);

        const rowNumber = rowMatch ? parseInt(rowMatch[1], 10) : null;
        const colNumber = colMatch ? parseInt(colMatch[1], 10) : null;

        // Validate row and column numbers
        if ((rowNumber && (rowNumber < 1 || rowNumber > 50))) {
            return res.status(400).json({ error: 'Please choose between 1-50 rows.' });
        }

        if((colNumber && (colNumber < 1 || colNumber > 15))) {
            return res.status(400).json({ error: 'Please choose between 1-15 columns.' });
        }
        
        // Generate content
        const genAI = new GoogleGenerativeAI(process.env.VITE_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an AI assistant for a spreadsheet application. Your task is to interpret user queries related to summing, averaging, finding the maximum, finding the minimum, and counting values in rows and columns, and extract the relevant row or column numbers.

        Instructions:
        1. If the user query involves finding the sum of a specific row, extract the row number and return it in the format SUMROW(row number).
        2. If the user query involves finding the sum of a specific column, extract the column number and return it in the format SUMCOL(column number).
        3. If the user query involves finding the average value in a specific row, extract the row number and return it in the format AVERAGEROW(row number).
        4. If the user query involves finding the average value in a specific column, extract the column number and return it in the format AVERAGECOL(column number).
        5. If the user query involves finding the maximum value in a specific row, extract the row number and return it in the format MAXROW(row number).
        6. If the user query involves finding the maximum value in a specific column, extract the column number and return it in the format MAXCOL(column number).
        7. If the user query involves finding the minimum value in a specific row, extract the row number and return it in the format MINROW(row number).
        8. If the user query involves finding the minimum value in a specific column, extract the column number and return it in the format MINCOL(column number).
        9. If the user query involves counting the number of cells containing numerical values in a specific row, extract the row number and return it in the format COUNTROW(row number).
        10. If the user query involves counting the number of cells containing numerical values in a specific column, extract the column number and return it in the format COUNTCOL(column number).
        11. Ensure that the extracted row or column number is accurate and clearly identified.
        12. If the user query does not match any of the above conditions, return "Invalid input".
        
        User query: "${description}".
        Please provide the appropriate response based on the above instructions.`;

        const result = await model.generateContent(prompt);
        const output = await result.response.text();

        console.log(output);
        res.json({ response: output });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating content' });
    }
};

export { geminiController };