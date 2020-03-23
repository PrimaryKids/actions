'use strict'
const Shopify = require('shopify-api-node');
const core = require('@actions/core');
const shopifyStore = process.env.SHOPIFY_STORE;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const themeName = process.env.SHOPIFY_THEME_NAME;

const shopify = new Shopify({
  shopName: shopifyStore,
  apiKey: apiKey,
  password: apiSecret
});

async function run(action) {
  try {
    let themes = await shopify.theme.list()
    themes.forEach(theme => {
      if(['get', ''].includes(action)) {
        console.log(theme)
      }
      else if (theme.name === themeName) {
        if(action === 'delete') {
          shopify.theme
            .delete(theme.id)
            .then(
              (result) => core.debug(result),
              (err) => console.error(err)
            );
        }
        else if(action === 'publish') {
          const params = {'theme':{'role':'main'}};
          shopify.theme
            .update(theme.id, params.theme)
            .then(
              (result) => core.debug(result),
              (err) => console.error(err)
            );
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// First try to set action variable if in GitHub Actions environment
// else set it from command line argument
var action = core.getInput('action')
if (!action) {
  action = process.argv.slice(2);
}

run(action)
