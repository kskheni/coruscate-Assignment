const express = require('express');
const app = express();
const multer = require("multer");

const userController = require('../controllers/user.controller');
const isAuthMiddleware = require('../middleware/isAuthorised.middleware');
const router = express.Router();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);

    } else {
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname.split(".")[0]}${Date.now().toString()}.${file.mimetype.split('/')[1]}`);
    }
});

var uploadFrame = multer({ 
    fileFilter,
    storage: storage
});

router.get('/',userController.getHomepage);
router.get('/register',userController.getRegistrationPage);
router.get('/login',userController.getLoginpage);
router.get('/createPost',isAuthMiddleware,userController.getCreatePostsPage);
router.get('/user/:username',userController.getUserProfile);
router.get('/logout',isAuthMiddleware,userController.logout);
router.get('/myProfile',isAuthMiddleware,userController.getMyProfile);


router.post('/addNewUser',userController.enrolNewUser);
router.post('/authenticateUser',userController.authenticateUser);
router.post('/createPost',uploadFrame.single('postImage'),userController.createPost);


module.exports = router;

