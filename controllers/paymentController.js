const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);
const Image = require('../models/Image');
const Transaction = require('../models/Transaction')

exports.purchaseImage = (req, res) => {
    const imageId = req.body.imageId;

    if (!imageId)
        return res.status(400).json({error: 'Please specify image id'});

    Image.findById(imageId, (err, image) => {
        if (err)
            return res.status(400).json({error: 'Please specify image id'});

        if (!image.is_available)
            return res.status(403).json({ error: 'Image is unavailable to be purchased'});
        

        // creating a charge
        stripe.charges.create(
            {
                amount: image.price,
                currency: "cad",
                source: 'tok_mastercard',
                description: `Payment for ${image.imageName}`,
            }, (err, charge) => {
                if (err)
                    return res.status(400).json({error: 'Error creating stripe charge'});

                // create a transaction
                let transaction = new Transaction({
                    price: charge.amount,
                    user_id: req.user._id,
                    image_id: image._id
                });

                transaction.save((err, result) => {
                    if (err) 
                        return res.status(400).json({error: 'Error creating transaction'});
                    
                    // set is_available to false as image has been purchased
                    image.is_available = false;
                    image.save((err) => {
                        if (err) 
                            return res.status(400).json({error: 'Error purchasing image'});

                        return res.status(200).json({message: `Purchased image with id: ${image._id} successfully for $${result.price}`});
                    });
                })
            }
        );
    });
}