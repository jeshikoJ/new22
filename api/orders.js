const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!supabase) {
        return res.status(500).json({ 
            success: false, 
            error: 'Supabase URL or Key is missing.',
            keysFound: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('KEY') || k.includes('URL'))
        });
    }

    try {
        if (req.method === 'POST') {
            const { customerName, customerPhone, customerAddress, items, totalAmount } = req.body;
            
            const { data, error } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: customerName,
                        customer_phone: customerPhone,
                        customer_address: customerAddress,
                        items: items,
                        total_amount: totalAmount,
                        status: 'Pending'
                    }
                ])
                .select();

            if (error) throw error;
            return res.status(201).json({ success: true, order: data[0] });
        } 
        else if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json({ success: true, orders: data });
        }
        else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
