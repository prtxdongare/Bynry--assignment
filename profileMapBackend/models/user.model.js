import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  photo: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  contact: {
    type: String,
  },
  interests: {
    type: [String],
  }
});

// Compile model from schema
const User = mongoose.model('User', userSchema);

export default User;
