const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const postModel = require("../models/post.model");

const authenticateUser = (req,res) => {
    var enteredData = req.body;

    var checkCreditentials = async() => {
        const correctData = await userModel.find({username: enteredData.username});

        if(correctData.length == 0){
            console.log("username not found");
            res.redirect('/login');
        }
        else{
            const match = await bcrypt.compare(enteredData.password, correctData[0].password);

            if(match) {
                console.log("correct creditentials, set session and give access");
                req.session.userID = enteredData.username;
                res.redirect('/');
            }
            else{
                console.log("wrong  password");
                res.redirect('/login');
            }
        }
    }

    checkCreditentials();
}

const enrolNewUser = async (req,res) => {
    var formdata = req.body;

    const check_user = await userModel.find({"username": formdata.username})

    if(check_user.length >= 1){
        return res.send("username already exists")
    }//end here

    try{
        const hashedPassword = await bcrypt.hash(formdata.password, 10);

        const newDoc = new userModel({
            fullName: formdata.nameofuser,
            username: formdata.username,
            password: hashedPassword
        });

        await newDoc.save();

        return res.redirect("login")
    }
    catch(err){
        console.log(err)
    }
}

const createPost = async (req,res) => {
    //upload image

    try{
        const newDoc = new postModel({
            imageName: "/images/" + req.file.filename,
            title: req.body.titleofpost,
            nameOfCreator: req.session.userID
        });

        await newDoc.save();

        await userModel.updateOne(
            {username: req.session.userID},
            { $push: {posts: newDoc._id}}
        )
    }
    catch(err){
        console.log(err)
    }
    res.redirect("/");
}

const logout = async (req,res) => {
    try{
        const response = await req.session.destroy();
        res.redirect('/');
    }
    catch(err){
        res.send(err);
    }
}

const getHomepage = async (req,res) => {

    const allPosts = await postModel.find({});
    res.render("home", {Posts: allPosts});

}

const getUserProfile = async (req,res) => {
    
    var username = req.params.username;
    const userDetails = await userModel.find({"username": username});

    if(userDetails.length == 0){
        res.send("username does not exist");
    }

    const userPosts = await postModel.find({"nameOfCreator": username});

    res.render('userprofile',{userDetails: userDetails[0], userPosts: userPosts});
}

const getMyProfile = (req,res) => {
    res.redirect("/user/"+req.session.userID);
}


const getRegistrationPage = (req,res) => {
    res.render('register');
}

const getLoginpage = (req,res) => {
    res.render('login');
}

const getCreatePostsPage = (req,res) => {
    res.render('createPost');
}

module.exports = {
    getHomepage,
    getRegistrationPage,
    getLoginpage,
    logout,
    getCreatePostsPage,
    getUserProfile,
    enrolNewUser,
    authenticateUser,
    createPost,
    getMyProfile
}

