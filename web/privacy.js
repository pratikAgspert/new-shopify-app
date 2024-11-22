import { DeliveryMethod } from "@shopify/shopify-api";
import fs from 'fs';
import path from 'path';

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);

    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("PRODUCTS_CREATE", payload);
    const data = {
      topic,
      shop,
      body: payload,
      webhookId
    };

    const filePath = path.join('product_create_data.json');

    fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Product create data saved successfully');
      }
    });
    },
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    const data = {
      topic,
      shop,
      body: payload,
      webhookId
    };

    const filePath = path.join('product_update_data.json');

    fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Product update data saved successfully');
      }
    });
    },
  },
  PRODUCTS_DELETE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    
    const data = {
      topic,
      shop,
      body: payload,
      webhookId
    };

    const filePath = path.join('webhook_data.json');

    fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Webhook data saved successfully');
      }
    });
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("APP_UNINSTALLED", payload);
    const data = {
      topic,
      shop,
      body: payload,
      webhookId
    };

    const filePath = path.join('shop_uninstalled.json');

    fs.appendFile(filePath, JSON.stringify(data) + '\n', (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('Shop uninstalled data saved successfully');
      }
    });
    },
  },
};
