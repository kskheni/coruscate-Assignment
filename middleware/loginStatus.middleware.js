module.exports = (req,res,next) => {
    if(req.session.userID){
        req.loginStatus = true;
    }
    else{
        req.loginStatus = false;
    }
    next();
}