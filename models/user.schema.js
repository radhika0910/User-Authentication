// models/user.schema.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  session: {
    token: {
      type: String
    },
    expiration: {
      type: Date
    }
  }
});

export default mongoose.model('User', userSchema);
