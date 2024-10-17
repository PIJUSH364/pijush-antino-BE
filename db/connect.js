import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default dbConnect;
