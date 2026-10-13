const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

const registerUser = async(req, res) =>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message : "Please provide name, email, and password"});
        }

        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message : 'User already exists with this email'});
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }else{
            res.status(400).json({message: 'Invalid user data'});
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

const loginUser = async (req, res) => {
    try{
        const {email , password} =req.body;

        if(!email || !password){
            return res.status(400).json({message : 'Please provide email and password'});
        }

        const user = await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        }else{
            res.status(400).json({message : 'Invalid email or password'});
        }
    }catch(err){
        res.status(500).json({message : err.message});
    }
};

const getMe = async(req, res) =>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        res.status(500).json({message : err.message});
    }
};

module.exports = {registerUser , loginUser , getMe};