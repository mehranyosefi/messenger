import mongoose from 'mongoose';
mongoose.Schema.Types.String.cast(false)
const connectToMongoDB = async () => {
  let databaseUrl: string;
  if(process.env.NODE_ENV === 'development') databaseUrl = process.env.DATABASE_LOCALE_URL || "mongodb://127.0.0.1:27017/test"
  else databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in the .env file");
  }

  try {
    const connection = await mongoose.connect(databaseUrl, {
      autoCreate: true
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // process.exit(1);
  }
};

export default connectToMongoDB;