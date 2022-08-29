const express = require('express');
const axios = require('axios');

class WixAuthController {
    constructor(appId, wixOAuthFacade, refreshTokenDao, redirectUrl, baseUrl) {
        this.appId = appId;
        this.redirectUrl = redirectUrl;
        this._router = express.Router();
        this.wixOAuthFacade = wixOAuthFacade;
        this.refreshTokenDao = refreshTokenDao;
        this.baseUrl = baseUrl;
        this.registerRoutes();
    }

    registerRoutes() {
        this._router.get('/redirect-wix', this.redirectUrlHandler);
        this._router.get('/app-wix', this.appUrlHandler);
    }

    get router() {
        return this._router;
    }

    appUrlHandler = async (req, res) => {
        const getInstallUrl = token =>
            `${this.baseUrl}/installer/install?token=${encodeURIComponent(token)}&state=start&appId=${encodeURIComponent(this.appId)}&redirectUrl=${encodeURIComponent(this.redirectUrl)}`;
        console.log(getInstallUrl(req.query.token))
        res.redirect(getInstallUrl(req.query.token));
    }

    redirectUrlHandler = async (req, res) => {
        const tokenReceivedEndpoint = `${this.baseUrl}/installer/token-received`;
        //wix instance Id of the app installation on site.
        const {refreshToken, accessToken} = await this.wixOAuthFacade.getTokensFrom(req.query.code);
        
        await this.refreshTokenDao.save(req.query.instanceId, refreshToken);
        const s = await this.refreshTokenDao.getBy(req.query.instanceId);
        console.log('in redirectUrlHandler',s);
        res.redirect(`${tokenReceivedEndpoint}?access_token=${encodeURIComponent(accessToken)}`);
    }
}

module.exports = {
    WixAuthController
}
