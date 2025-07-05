import mongoose from 'mongoose';
import validator from 'validator';

const addressSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: Object,
    default: {}
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  addresses: {
    type: [addressSchema],
    default: []
  },

  
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
  
}, {
  minimize: false,
  timestamps: true
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;
