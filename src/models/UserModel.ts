import mongoose, { Model } from "mongoose";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  age?: number;
  slug?: string;

  passwordChangedAt?: Date;

  comparePassword(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

interface UserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>({
    name: {
      type: String,
      required: [true, "The name field is required"],
      minlength: [2, "Name must be at least 2 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "The email field is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Invalid email format",
      ],
    },

    password: {
      type: String,
      required: [true, "The password field is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String || undefined,
      required: [true, "Please confirm your password"],
      validate:{
        //this only work on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password
        }
      }
    },

    age: {
      type: Number,
    },

    slug: {
      type: String,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
userSchema.pre('save', function(){
  this.slug = slugify(this.name, { lower: true, strict: true });
  //not necessary any more next()
})
userSchema.pre("save", async function (next:NextFunction) {
  // Password hasn't changed
  if (!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined
});

//QUERY MIDDLEWARE
// userSchema.pre(/^find/, function(doc){
//   this.find({ age: { $lte: 40 } })
// })
// userSchema.post(/^find/, function(doc){
//   // console.log('runs after then the post method saved')
// })



//AGGREGATION MIDDLEWARE
// userSchema.pre('aggregate', function() {
//   //
// })


const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;


/********  example use ********/

// const newUser = new User({
//   name: "mehran",
//   email: 'mehran@gmail.com',
//   age: 24
// })
// const res = await newUser.save()

