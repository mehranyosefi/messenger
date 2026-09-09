import mongoose from 'mongoose';
mongoose.Schema.Types.String.cast(false)
const connectToMongoDB = async () => {
  const databaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.DATABASE_LOCALE_URL
    : process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      process.env.NODE_ENV === "development"
        ? "DATABASE_LOCAL is not defined"
        : "DATABASE_URL is not defined"
    );
  }
  try {
    console.log(databaseUrl)
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