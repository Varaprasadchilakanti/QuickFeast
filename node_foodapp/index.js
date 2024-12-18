const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const winston = require('winston');
dotenv.config();

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Rate limiting middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});

// Rate limiting middleware for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each user to 5 login attempts per windowMs
    message: 'Too many login attempts. Please try again later.' // Message to send after reaching limit
});

app.use('/api/', apiLimiter); // Apply to all API routes

// MongoDB Schemas
const ItemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    foodtype: { type: String, required: true }, // Veg or Non-Veg
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String }, // Google ID for OAuth
    isVerified: { type: Boolean, default: false } // Email verification status
});

const QuerySchema = new mongoose.Schema({
    id: { type: String, required: true },
    query: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    cuisine: { type: String, required: true }, // Example: Italian, Chinese, etc.
    isVegOnly: { type: Boolean, required: true }, // true if the restaurant serves only vegetarian food
});

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ 
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    billingDetails: { type: String, required: true }, // Additional details like address
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const Query = mongoose.model('Query', QuerySchema);
const Item = mongoose.model('Item', ItemSchema);
const User = mongoose.model('User', UserSchema);

// Authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};


// Google Authentication Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                password: null // Set password as null since we don't use it for Google users
            });
            await user.save();
        }
        done(null, user);
    } catch (err) {
        console.error('Error in Google strategy:', err);
        done(err, null);
    }
}));

// Serialize user to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Auth Routes
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/api/success',
    failureRedirect: '/api/failure'
}));

app.get('/api/success', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'Login successful!', user: req.user });
});

// Email Verification Function
async function sendVerificationEmail(user) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: 
        http://localhost:${process.env.PORT || 3002}/verify-email/${user._id}`,
    };

    await transporter.sendMail(mailOptions);
}

// Get all items with filters applied
app.get('/items', async (req, res) => {
    const { restaurant, category, foodType, sortPrice, rating } = req.query;

    let query = {};
    if (restaurant && restaurant !== 'All') query.restaurant = restaurant;
    if (category && category !== 'All') query.category = category;
    if (foodType && foodType !== 'All') query.foodType = foodType === 'Veg';
    if (rating && rating !== 'All') query.rating = { $gte: Number(rating) };

    // Fetch items with filters
    let items = await Item.find(query).populate('restaurant', 'name'); // Populate restaurant name based on ID

    // Sorting by price
    if (sortPrice === 'lowToHigh') {
        items = items.sort((a, b) => a.price - b.price);
    } else if (sortPrice === 'highToLow') {
        items = items.sort((a, b) => b.price - a.price);
    }

    res.json(items);
});

// Get filter options (restaurants and categories)
app.get('/filter-options', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().select('name'); // Get restaurant names
        const categories = await Item.distinct('category');
        res.json({ restaurants, categories });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch filter options' });
    }
});

// Get user data by ID (from the token)
app.get('/users/me', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ name: user.name, email: user.email, country: user.country });
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Get orders for the logged-in user
app.get('/orders', authenticateJWT, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.item');
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/register', [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email format.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/\d/).withMessage('Password must contain at least one number.')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully. Please log in.' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Verify Email Route
app.get('/verify-email/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');

        user.isVerified = true;
        await user.save();
        res.send('Email verified successfully!');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Login Route
app.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if the user exists and is verified
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Create and return JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        return res.status(200).json({ message: 'Login successful!', token }); // Enhanced response
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Improved error response
    }
});

app.post('/queries', async (req, res) => {
    const { id, query } = req.body;

    const newQuery = new Query({ id, query });

    try {
        await newQuery.save();
        res.status(200).send('Query received successfully.');
    } catch (error) {
        console.error('Error saving query:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Centralized Error Handling Middleware
const createError = require('http-errors');

// Improved centralized error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    // Handle validation errors
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ success: false, message: err.message });
    }
    // Handle cast errors (e.g., invalid ObjectId)
    if (err instanceof mongoose.Error.CastError) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    // Handle duplicate key errors (e.g., unique constraint violations)
    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'Duplicate key error' });
    }
    // Handle specific known errors
    if (err.status) {
        return res.status(err.status).json({ success: false, message: err.message });
    }
    // Generic error handler
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});


// Swagger Documentation Setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Food Delivery API',
            version: '1.0.0',
            description: 'API documentation for the Food Delivery app',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3002}`,
            },
        ],
    },
    apis: ['index.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});