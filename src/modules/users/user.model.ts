import mongoose, { Model } from "mongoose";
import slugify from "slugify";
import bcrypt from "bcryptjs";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string | undefined;
  age?: number;
  slug?: string;
  passwordChangedAt?: Date;
  username?: string;
  avatar?: string | null;
  comparePassword(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  changedPawwordAfter(JWTTimestamp:number): boolean

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
      type: String,
      required: [true, "Please confirm your password"],
      validate:{
        //this only work on CREATE and SAVE!!!
        validator: function (this: IUser, value: string): boolean {
          return value === this.password
        }
      }
    },

    age: {
      type: Number,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: null,
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
userSchema.pre("save", async function () {
  // Password hasn't changed
  if (!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined
});

userSchema.methods.comparePassword = async function(candidatePassword: string, hashedPassword: string) {
  return await bcrypt.compare(candidatePassword, hashedPassword)
}

userSchema.methods.changedPawwordAfter = function(JWTTimestamp: number):boolean {
  if(this.passwordChangedAt) {
    const changedTimestamp = Math.floor( 
     this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimestamp < changedTimestamp
  }
  return false
}

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

