import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Contents from "../models/JobModel.js";
import Job from "../models/JobModel.js";
import { hashPassword } from "../utils/passwordUtils.js";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));


export const getCurrentUser = async (req, res, id) => {
    id = req.user.userId
    // console.log("getCurrentUser called with id:", id);
    
    const user = await User.findOne({_id:id})
    const userWithoutPassword = user.toJSON()
    res.status(StatusCodes.OK).json({user: userWithoutPassword})
}

export const getTeacher = async (req, res) => {
    const uid = req.params.id
    const teacher = await User.findById(uid);
    res.status(StatusCodes.OK).json({name:teacher.name})
}

export const getApplicationStats = async (req, res) => {
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const verifiedJobs = await Job.countDocuments({ verified: true });
    const unverifiedJobs = await Job.countDocuments({ verified: false });

    res.status(StatusCodes.OK).json({
        adminUsers,
        regularUsers,
        verifiedJobs,
        unverifiedJobs,
});
}
export const updateUser = async (req, res) => {
    const newPassword = req.body.password;
    const user = await User.findById(req.user.userId);
    const hashedPassword = await hashPassword(newPassword);
    if (newPassword) {
      user.password = hashedPassword;
      await user.save();
    }
    res.status(StatusCodes.OK).json({ msg: 'User updated successfully' });
}

export const downloadPDF = async (req, res) => {
    console.log("hello")
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const fileID = req.params.fileId;
    const file = await Contents.findById(fileID);
    const cost = file.cost || 110;
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }
    if (!file) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'File not found' });
    }
    if(user.wallet<cost){
        return res.status(StatusCodes.FORBIDDEN).json({ error: 'Insufficient wallet balance to download file, "Learn more to Earn More"' });
    }
    user.wallet -= cost;
    console.log("File to download:", file.file);
    user.save().then(
        res.sendFile(__dirname+"/"+file.file, (err) => {
        if (err) {
            console.error('File download error:', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error downloading file');
        } else {
            console.log('File downloaded successfully');
        }
        })
    ).catch(err => {
        console.error('Error saving user wallet:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error processing download' });
    });
}
