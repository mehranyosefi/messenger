import mongoose from 'mongoose';
mongoose.Schema.Types.String.cast(false)
const connectToMongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_LOCALE_URL || '', {
      autoCreate: true
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    // process.exit(1);
  }
};

export default connectToMongoDB;