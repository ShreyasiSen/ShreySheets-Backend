import Sheet from '../models/sheet.js';
import User from '../models/user.js';

export const createSheet = async (req, res) => {
    const newSheet = new Sheet(req.body);
    const userId = req.params.userId; 
    try {
        await newSheet.save();
        try{
            await User.findByIdAndUpdate(userId, { $push: { spreadsheets: newSheet._id } });
        }
        catch(error){
            res.status(409).json({ message: error.message });
        }
        res.status(201).json(newSheet);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }       
}

export const getSheet = async (req, res) => {
    try {
        const sheet = await Sheet.findById(req.params.id);
        res.status(200).json(sheet);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

