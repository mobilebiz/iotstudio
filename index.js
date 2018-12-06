exports.handler = function(event, context, callback) {
    const crypto = require('crypto');
    const https = require('https');

    // Twilio Account Sid and Auth Token
    const authToken = process.env.AUTH_TOKEN;

    // Twilio Function Domain
    let functionDomain = process.env.FUNCTION_DOMAIN;

    // Make a X-Twilio-Signature
    const signature = crypto.createHmac('sha1', authToken)
        .update(new Buffer(`https://${functionDomain}/serial-call-studio`, 'utf-8'))
        .digest('Base64');

    // HTTPS Options
    const options = {
        hostname: functionDomain,
        port: 443,
        path: '/serial-call-studio',
        headers: {
            'X-Twilio-Signature': signature
        }
    };

    // Function request
    const req = https.get(options, (res) => {
        let result = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            result = chunk;
        });
        res.on('end', () => {
            callback(null, result);
        })
    });

    // Error handling
    req.on('error', (e) => {
        callback(e);
    });

    req.end();
}