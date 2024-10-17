import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    calculatedField: {
        type: {
            wordCount: { type: Number, default: 0 },
            hashtag: { type: String, default: '' }
        },
        default: {} // Initialize `calculatedField` as an empty object by default
    }
});

export default mongoose.model('Data', dataSchema);
