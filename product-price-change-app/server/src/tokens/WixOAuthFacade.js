const axios = require('axios');

class WixOAuthFacade {

    constructor(appId, appSecret) {
        this.baseUrl = "https://www.wixapis.com";
        this.appId = appId;
        this.appSecret = appSecret;
    }

    async getTokensFrom(authCode) {
        const {data} = await axios.post(`${this.baseUrl}/oauth/access`, {
            code: authCode,
            client_secret: this.appSecret,
            client_id: this.appId,
            grant_type: 'authorization_code',
        });
        return {
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
        }
    }

    async getFreshAccessToken(refresh_token) {
        const {data} = await axios.post(`${this.baseUrl}/oauth/access`, {
            refresh_token,
            client_secret: this.appSecret,
            client_id: this.appId,
            grant_type: 'refresh_token',
        });
        return {
            accessToken: data.access_token,
        }
    }


}

module.exports = {
    WixOAuthFacade
}
