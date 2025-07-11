// import mongoose from 'mongoose';

// export const Db_Connection = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       dbName: process.env.DB_NAME,
//     });
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.error('Database connection error:', err);
//     process.exit(1);
//   }
// };

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const Db_Connection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME, // Ensure DB_NAME is set in .env
      authSource: "admin", // Add this if your user is in the "admin" database
    });

    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};
