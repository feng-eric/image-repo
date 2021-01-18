const User = require('../models/User');

// Sign up
exports.register = async (req, res, next) => {
    const { username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({error: 'Invalid request body'});
    }

    try {
        const user = new User({username, password});

        await user.save()
            .catch((err) => {
                console.log(err)
                return res.status(400).json({error: 'Error creating user'});
            });
        
        return res.status(201).json({
            message: 'Created user successfully',
            username: user.username
        });
    } catch(err) {
        next(err);
    }
};

// Login
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user)
            return res.status(400).json({error: 'Invalid username'});

        const isValidPassword = await user.verifyPassword(password);

        if (!isValidPassword)
            return res.status(400).json({error: 'Invalid password'});

        const token = await user.generateAuthToken();

        return res.json({
            username: user.username, 
            token
        });
    } catch (err) {
        next(err);
    }
};
