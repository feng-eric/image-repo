const AWS = require('aws-sdk');
const Image = require('../models/Image');

// Get all public images
exports.getAllPublicImages = (req, res) => {
    Image.find({is_private : false}, (err, images) => {
        if (err)
            return res.status(400).json({error: 'Error retrieving images'})

        res.status(200).json({
            message: 'Retrieved all images',
            images
        });
    });
};

// Search images
exports.searchImages = (req, res) => {
    const filter = new RegExp(req.query.filter, 'i');
    
    Image.find({is_private: false, $or:[{name: filter}, {categories: filter}]}, (err, data) => {
        if (err)
            res.status(400).json({error: 'Error searching images'});
        
        res.status(200).json(data);
    })
};

// Get Images for logged in user
exports.getUserImages = (req, res) => {
    Image.find({user_id: req.user._id}, (err, data) => {
        if (err) 
            res.status(400).json({
                error: `Error retrieving images for user: ${req.user._id}`
            })
        res.status(200).json(data);
    });
};

// Get image by category
exports.getImageByCategory = (req, res) => {
    if (!req.params.category) 
        res.status(400).json({error: 'Error retrieving images. Please specify category'});
    
    Image.find({
        is_private: false,
        categories: req.params.category
    }, (err, data) => {
        if (err) 
            res.status(400).json({error: `Error retrieving images for category: ${req.params.category}`});

        res.status(200).json(data);
    });
};

// Get image by id
exports.getImageDetails = (req, res) => {
    if (!req.params.id)
        return res.status(400).json({error: 'Please specify image id'});

    Image.findById(req.params.id, (err, image) => {
        if (image.user_id != req.user._id) 
            return res.status(403).json({ error: 'You do not own this image'});
        

        res.status(200).json({
            message: 'Retrieved image successfully',
            image
        });
    });
};

// Upload image
exports.uploadImage = (req, res) => {
    const image = req.file;
    const { imageName, price }  = req.body;
    if (!image || !imageName || !price) 
        return res.status(400).json({error: 'Please include image, imageName, and price'});

    const isPrivate = req.body.isPrivate;
    if (!isPrivate)
        isPrivate = false;

    const user = req.user;
 
    const s3FileURL = process.env.AWS_UPLOAD_FILE_URL;
  
    const s3Bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype,
        ACL: "public-read"
    };

    let categories = [];
    if (req.body.categories) {
        categories = req.body.categories.toLowerCase().split(',');
    }

    s3Bucket.upload(params, (err, data) => {
        if (err) {
            return res.status(400).json({error: 'Error uploading image to S3'});
        } 

        Image.updateOne(
            { file_link: s3FileURL + image.originalname },
            {
                $set: {
                    name: imageName,
                    file_link: s3FileURL + image.originalname,
                    s3_key: params.Key,
                    user_id: user._id,
                    categories: categories,
                    is_private: isPrivate,
                    is_available: true,
                    price: price
                }
            },
            {
                upsert: true
            },
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({error: 'Error uploading image.'});
                }

                res.json({ 
                    message: 'Image uploaded successfully', 
                    link: data.Location
                });
            }
        );
    });
};

// Update image details (Name, Category, Access)
exports.updateImageDetails = (req, res) => {
    if (!req.params.id)
        return res.status(400).json({error: 'Please specify image id'});

    const updateQuery = {};

    if (req.body.imageName) {
        updateQuery.name = req.body.imageName;
    }

    if (req.body.categories) {
        updateQuery.categories = req.body.categories.toLowerCase().split(',');
    }

    if (req.body.isPrivate) {
        updateQuery.is_private = req.body.isPrivate;
    }

    if (req.body.price) {
        updateQuery.price = req.body.price;
    }

    Image.findById(req.params.id, (err, image) => {
        if (err) 
            return res.status(400).json({error: `Error retrieving image with id: ${req.params.id}`});

        if (image.user_id != req.user._id) 
            return res.status(403).json({ error: 'Unable to update as you do not own this image'});
        
        Image.updateOne(
            {
                _id: image._id
            }, 
            updateQuery,
            {
                new: true
            },
            (err) => {
            if (err)
                return res.status(400).json({error: 'Error updating image details'});

            return res.status(200).json({message:`Image updated successfully.`});
        })
    });
};

// Delete image
exports.deleteImage = (req, res) => {
    if (!req.params.id)
        return res.status(400).json({error: 'Please specify image id'});

    Image.findById(req.params.id, (err, image) => {
        if (err) 
            return res.status(400).json({error: `Error retrieving image with id: ${req.params.id}`});

        if (image.user_id != req.user._id) 
            return res.status(403).json({ error: 'Unable to delete as you do not own this image'});

        Image.deleteOne({_id: image._id}, (err, result) => {
            if (err || !result) {
                return res.status(400).json({error: `Error deleting image with id: ${req.params.id}`});
            }
            
            const s3Bucket = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });
            
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: image.s3_key,
            };
    
            s3Bucket.deleteObject(params, (err) => {
                if (err) {
                    return res.status(400).json({error: 'Error deleting image from S3'});
                }
                    
                
                return res.status(200).json({message:`Image deleted successfully.`});
            });
        })

    });
};
