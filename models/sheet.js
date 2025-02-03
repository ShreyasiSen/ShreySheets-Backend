import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema({
    userid : {
        type: String,
        required: false,
    },
    sheetTitle: {
        type: String,
        required: true,
    },
    data: {
        type: [[{type: String, isBold: Boolean, isItalic: Boolean, fontSize: String, Color: String}]],
        required: false,
    },
});

export default mongoose.model("Sheet", sheetSchema);