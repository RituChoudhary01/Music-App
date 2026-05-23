import TryCatch from "./TryCatch.js";
import {User} from "./model.js"
import {AuthenticatedRequest} from "./middleware.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


export const registerUser = TryCatch(async(req,res)=>{
  const {name,email,password} = req.body
  let user = await User.findOne({email});
  if(user){
    res.status(400).json({
      message:"User Already exists",
    });
    return;
  }
  const hashPassword = await bcrypt.hash(password,10);
  user = await User.create({
    name,email,password:hashPassword,
  });
  const token = jwt.sign({_id:user._id},process.env.JWT_SEC as string,{
    expiresIn:"7d",
  });
  res.status(201).json({
    massage:"User Registered",
    user,
    token,
  });
});

export const loginUser = TryCatch(async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    res.status(404).json({
      message:"User not exist",
    })
    return;
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch){
    res.status(400).json({
      message:"Invalid Password",
    });
    return;
  }
  const token = jwt.sign({_id:user._id},process.env.JWT_SEC as string,{
    expiresIn:"7d",
  });
  res.status(200).json({
    message:"Logged IN",
    user,
    token,
  });
});

export const myProfile =  TryCatch(async(req:AuthenticatedRequest,res)=>{
  const user = req.user;
  res.json(user);
});

export const addToPlaylist = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const videoId = req.params.id;

    if (!videoId || Array.isArray(videoId)) {
      res.status(400).json({
        message: "Invalid video id",
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "No user with this id",
      });
      return;
    }

    if(user.playlist.includes(videoId)){
      const index = user.playlist.indexOf(videoId);
      user.playlist.splice(index, 1);
      await user.save();

      res.json({
        message: "Removed from playlist",
        videoId,
      });
      return;
    }

    user.playlist.push(videoId);
    await user.save();

    res.json({
      message: "Added to playlist",
      videoId,
    });
  }
);