# Shopify Internship Challenge

This repository is my submission for the Shopify Challenge!

# Project Features
- User authentication 
- Secure uploading and storing images to AWS S3
- Viewing own (public + private) images
- Viewing public images
- Viewing images by category
- Viewing specific images
- Searching image by name or categories
- Editing image details
- Deleting images
- Access control to ensure that only owner can edit or delete images
- Purchasing images through Stripe

# How I Built It
The tools used in the project consists of **Node.js** and **Express**, which is connected to **MongoDB**. For image storage, **AWS S3** was levaraged. **Stripe** was used for image purchases.

# Setup
Ensure that Node.js is downloaded and have a MongoDB database and AWS S3 bucket set up.

1. Clone the project with ```git clone https://github.com/feng-eric/image-repo.git```
2. Create a ```.env``` file in the root directory and request the following environment variables from me.
``` 
MONGO_DB_URL=
JWT_KEY=
PORT=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_UPLOAD_FILE_URL=
STRIPE_KEY=
```
3. Install dependencies for the project using ```npm install```
4. Start the server using ```npm start```

# Endpoints
- ```POST /users/register``` for registering a user
- ```POST /users/login``` for logging in a user, returning a JSON Web Token that is used to access protected routes
- ```POST /images``` for uploading the image, which is stored in AWS S3 (protected route)
- ```PUT /images/:id``` for editing image details, including image name, categories, and accessibility (protected route) 
- ```DELETE /images/:id``` for deleting an image (protected route)
- ```GET /images/me``` for retrieving all images owned by the user (protected route)
- ```GET /images/category/:category``` for retrieving images by on category
- ```GET /images/search?filter=sunny``` for searching images by image name or categories
- ```GET /images/all``` for retrieving all images that are public
- ```GET /images/:id``` for retrieving image by id 
- ```POST /payments``` for purchasing an image (protected route)

# What's Next
I want to add the functionality of being able to buy/sell/trade images with other users. Furthermore, adding the ability to favourite images would be an interesting feature to add too.
