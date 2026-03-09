const stripe = require('../config/stripe');
const { payments, orders } = require('../config/db'); 
const { ObjectId } = require('mongodb');

// POST /create-checkout-session
exports.createCheckoutSession = async (req, res) => {
    try {
        const paymentInfo = req.body;
        const amount = parseInt(paymentInfo.price) * 100;

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'BDT',
                        unit_amount: amount,
                        product_data: {
                            name: paymentInfo.name,
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: paymentInfo.email,
            metadata: {
                orderId: paymentInfo.orderId,
                orderName: paymentInfo.name,
            },
            success_url: `${process.env.SITE_DOMAIN}/dashboard/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.SITE_DOMAIN}/dashboard/user/payment-cancelled`,
        });

        res.send({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to create checkout session' });
    }
};

// PATCH /payment-success
exports.paymentSuccess = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const transactionId = session.payment_intent;

        // Check if payment already exists
        const paymentExist = await payments.findOne({ transactionId });
        if (paymentExist) {
            return res.send({
                message: 'already exists',
                transactionId,
                trackingId: paymentExist.trackingId,
            });
        }

        if (session.payment_status === 'paid') {
            const orderId = session.metadata.orderId;
            const orderQuery = { _id: new ObjectId(orderId) };
            const order = await orders.findOne(orderQuery);

            // Update order payment status
            const update = {
                $set: {
                    paymentStatus: 'paid',
                    trackingId: order.trackingId,
                },
            };
            const modifyOrder = await orders.updateOne(orderQuery, update);

            // Insert payment record
            const paymentRecord = {
                amount: session.amount_total / 100,
                currency: session.currency,
                customerEmail: session.customer_email,
                orderId: session.metadata.orderId,
                orderName: session.metadata.orderName,
                transactionId: session.payment_intent,
                paymentStatus: session.payment_status,
                paidAt: new Date(),
            };

            const paymentInfo = await payments.insertOne(paymentRecord);

            return res.send({
                success: true,
                modifyOrder,
                trackingId: order?.trackingId,
                paymentInfo,
            });
        }

        res.send({ success: false });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Payment processing failed' });
    }
};

// GET /payments
exports.getPayments = async (req, res) => {
    try {
        const email = req.query.customerEmail;

        const query = email ? { customerEmail: email } : {};
        const result = await payments.find(query).sort({ paidAt: -1 }).toArray();

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch payments' });
    }
};