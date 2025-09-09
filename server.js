const express = require('express');
const path = require('path');
const app = express();

let currentOTP = null;
let otpTimestamp = null;

app.use(express.static('public'));
app.use(express.json());

// API to generate OTP
app.get('/generate-otp', (req, res) => {
    currentOTP = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    otpTimestamp = Date.now();
    console.log(`Generated OTP: ${currentOTP}`);
    res.json({ message: 'OTP generated successfully' });
});

// API to verify OTP
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    const now = Date.now();
    const timeElapsed = (now - otpTimestamp) / 1000; // in seconds

    if (!currentOTP) {
        return res.json({ status: 'error', message: 'No OTP generated' });
    }

    if (timeElapsed > 120) {
        currentOTP = null;
        return res.json({ status: 'expired', message: 'OTP expired' });
    }

    if (otp === currentOTP) {
        currentOTP = null;
        return res.json({ status: 'success', message: 'OTP verified' });
    } else {
        return res.json({ status: 'error', message: 'Wrong OTP' });
    }
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
