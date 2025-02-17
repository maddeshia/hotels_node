const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Person schema
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    age:{
        type:Number
    },

    work:{
        type:String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

},{timestamps:true});

personSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if (!person.isModified('password')) {
        return next()
    }

    try {
        // Hash password generation
        const salt = await bcrypt.genSalt(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(person.password,salt);

        // Overide the plain password with the hashed one
        person.password = hashedPassword;
        next();

    } catch (error) {
        return next(error);
    }

})


personSchema.methods.comparePassword = async function(candidatePassword){
    try {
        // Use bcrypt to compare the provide password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}


const Person = mongoose.model('Person', personSchema);
module.exports = Person;