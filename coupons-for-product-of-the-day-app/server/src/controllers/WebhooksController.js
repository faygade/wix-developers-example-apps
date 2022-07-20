const express = require("express");


class WebhooksController {
    constructor(installationsService, productOfTheDayService, webhooksDecoder) {
        this._router = express.Router();
        this.installationsService = installationsService;
        this.webhooksDecoder = webhooksDecoder;
        this.productOfTheDayService = productOfTheDayService
        this.registerRoutes();
    }

    registerRoutes() {
        this._router.post('/app-removed', this.appRemovedWebhookHandler);
        this._router.post('/app-installed', this.appInstalledWebhookHandler);
        this._router.post('/plan-purchased', this.planPurchasedWebhookHandler);
        this._router.post('/inbox', this.wixInboxWebhookHandler)
    }

    appRemovedWebhookHandler = async (req, res) => {
        const {instanceId} = this.webhooksDecoder.verifyAndDecode(req.body);
        await this.installationsService.setUninstalled(instanceId);
        res.send('ok');
    }

    appInstalledWebhookHandler = async (req, res) => {
        const {instanceId} = this.webhooksDecoder.verifyAndDecode(req.body);
        await this.installationsService.create(instanceId);
        res.send('ok');
    }

    wixInboxWebhookHandler = async (req, res) => {
        const {instanceId, data} = this.webhooksDecoder.verifyAndDecode(req.body);
        await this.productOfTheDayService.sendCouponOfTheDay(instanceId, data?.actionEvent?.body?.conversationId);
        res.send('ok');
    }

    planPurchasedWebhookHandler = async (req, res) => {
        const {instanceId, data} = this.webhooksDecoder.verifyAndDecode(req.body);
        await this.installationsService.updatePremiumPlan(instanceId, data?.vendorProductId);
        res.send('ok');
    }

    get router() {
        return this._router;
    }



}

module.exports = {
    WebhooksController
}
