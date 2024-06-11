const User = require('../models/userModel');
const httpError = require("../models/errorModels");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require("uuid")
/* Register USER */
/* POST: api/users/register */
/* UNPROTECTED */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        
        if (!name || !email || !password || !confirmPassword) {
            return next(new httpError("Please fill the entire form.", 422));
        }
        
        const newEmail = email.toLowerCase();
        const existEmail = await User.findOne({ email: newEmail });
        
        if (existEmail) {
            return next(new httpError("Email already exists.", 422));
        }
        
        if (password.trim().length < 6) {
            return next(new httpError("Password should be at least 6 characters.", 422));
        }
        
        if (password !== confirmPassword) {
            return next(new httpError("Passwords do not match.", 422));
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashedPass
        });
        
        res.status(201).json(`your email${email} is registered.`);
    } catch (error) {
        next(new httpError("User registration failed.", 500));
    }
}

/* Login USER */
/* POST: api/users/login */
/* UNPROTECTED */
const loginUser =async (req, res, next) => {
    try {
        const {email,password} = req.body
        const newEmail = email.toLowerCase()
        const user =await User.findOne({email:newEmail})
        if(!user){
            return next(new httpError("Email does not exist",300))
        }
        const comparePassword = await bcrypt.compare(password,user.password)
        if(!comparePassword){
            return next(new httpError("Invalid password.",301))
        }
        const {_id:id,name} = user
        const token = jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).json({token,name,id})
    } catch (error) {
        return  next(new httpError(`${error.message}`,300))
    }
}


/* USER PROFILE */
/* POST: api/users/:id */
/* PROTECTED */
const userProfile =async (req, res, next) => {
    try {
        const {id} = req.params
        const user = await User.findById(id).select('-password')
        if(!user){
            return next(new httpError("USER CAN'T FOUND",305))
        }
        res.status(200).json(user)
    } catch (error) {
        return next(new httpError(`${error .message}`,304))
    }
    
}

/* AUTHORS */
/* POST: /api/users/authors */
/* PROTECTED */
const getAuthors =async(req, res, next) => {
    try {
        const getAuthors =await  User.find().select('-password')
        res.json(getAuthors)
    } catch (error) {
        return next(new httpError(`${error.message}`,205))
    }
}


/* User Avatar */
/* POST: /api/users/change-avatar */
/* PROTECTED */
const changeAvatar = async(req, res, next) => {
    console.log(req.body)
    try {
        if(!req.files.avatar) {
            return next(new httpError("Please choose an image.", 422))
        }
        // find user from database
        const user = await User.findById(req.user.id)
        // delete old avatar if exists
        if(user.avatar) {
        fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
            if(err) {
                return next(new httpError(err))
            }
        })
        }
        const {avatar} = req.files;
        // check file size
        if(avatar.size > 500000) {
        return next(new httpError("Profile picture too big. Should be less than 500kb"), 422)
        }
        let fileName;
        fileName = avatar.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename [0] + uuid() + '.' + splittedFilename [splittedFilename.length - 1]
        avatar.mv(path.join(__dirname,'..','/uploads', newFilename),async (err) => {
        if(err) {
         return next(new httpError(err))
        } 
        })
        const updateAvatar = await User.findByIdAndUpdate(req.user.id,{avatar:newFilename}, {new:true})
        if(!updateAvatar){
            return next(new httpError("Avatar could n't be changes",422))
        }
        res.status(200).json(updateAvatar)
    } catch (error) {
        return next(new httpError(`error:${error.message}`,403))
    }
}

/* Edit User */
/* POST: /api/users/edit-user */
/* PROTECTED */
const editProfile = async(req, res, next) => {
    try {
        const {name,email,currentpassword,newpassword} = req.body
        const user = await User.findById(req.user.id)
        if(!name || !email || !currentpassword || !newpassword){
            return next(new httpError("please fill everythin.",304))
        }
        const emailExist = await User.findOne({email})
        if(emailExist && emailExist._id != req.user.id){
            return next(new httpError("email already exist.",403))
        }
        const validuserPassword = await bcrypt.compare(currentpassword,user.password)
        if(!validuserPassword){
            return next(new httpError("invalid password",403))
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newpassword, salt);
        const updateProfile = await User.findByIdAndUpdate(req.user.id,{name, email, password:hashedPass}, {new:true})
        res.status(200).json(updateProfile)
    } catch (error) {
        return next(new httpError(error.message,500))
    }
}

module.exports = { registerUser, loginUser, userProfile, editProfile, changeAvatar, getAuthors };
