const express = require('express');
const CalendlyService = require('../services/calendlyService');
const { isUserAuthenticated, formatEventDateTime } = require('../utils');
const router = express.Router();

router.get('/data_union', isUserAuthenticated, async (req, res) => {
    const { access_token, refresh_token } = req.user;
    const calendlyService = new CalendlyService(access_token, refresh_token);

    const {
        collection,
        pagination
    } = await calendlyService.streamrDataTokenization();
    const events = collection.map(formatEventDateTime);

    res.json({ events, pagination });
});

module.exports = router;
