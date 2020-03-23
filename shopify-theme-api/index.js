'use strict'
const Shopify = require('shopify-api-node');
const core = require('@actions/core');
const shopifyStore = process.env.SHOPIFY_STORE;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const themeName = process.env.SHOPIFY_THEME_NAME;

async function run() {
  try {
    // First try to set action variable if in GitHub Actions environment
    var action = core.getInput('action')
    if (!action) {
      action = process.argv[2];
    }
    if(action && !['get','publish','delete'].includes(action)) {
      console.log('Usage: node index.js <action>')
      console.log('Action must be either "get", "publish", or "delete"')
      console.log('You provided \"'+action+'\"')
    }

    const shopify = new Shopify({
      shopName: shopifyStore,
      apiKey: apiKey,
      password: apiSecret
    });

    let themes = await shopify.theme.list()

    themes.forEach(theme => {
      if(!action || action === 'get') {
        console.log(theme)
      }
      else if (theme.name === themeName) {
        if(action === 'delete') {
          shopify.theme
            .delete(theme.id)
            .then(
              (result) => console.log(result),
              (err) => console.error(err)
            );
        }
        else if(action === 'publish') {
          const params = {'theme':{'role':'main'}};
          shopify.theme
            .update(theme.id, params.theme)
            .then(
              (result) => console.log(result),
              (err) => console.error(err)
            );
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

run()
