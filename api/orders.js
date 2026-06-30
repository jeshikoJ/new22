const mongoose = require('mongoose');

// MongoDB Connection caching for Serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    
    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside Vercel');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = conn;
    return conn;
}

// Order Schema
const OrderSchema = new mongoose.Schema({
    customerName: String,
    customerPhone: String,
    customerAddress: String,
    items: [{
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    totalAmount: Number,
    status: { type: String, default: 'Pending' },
    timestamp: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Serverless Handler
module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectToDatabase();

        if (req.method === 'POST') {
            // Create new order
            const order = new Order(req.body);
            await order.save();
            return res.status(201).json({ success: true, order });
        } 
        else if (req.method === 'GET') {
            // Fetch all orders for admin dashboard
            const orders = await Order.find().sort({ timestamp: -1 });
            return res.status(200).json({ success: true, orders });
        }
        else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
