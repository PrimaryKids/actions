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
      if(action == 'get' || action == '') {
        console.log(theme)
      }
      else if (theme.name == themeName) {
        if(action == 'delete') {
          shopify.theme.delete(theme.id).then
          ((result) => core.debug(result),
          (err) => console.error(err)
          );
        }
        else if(action == 'publish') {
          const params = {'theme':{'role':'main'}};
          shopify.theme.update(theme.id, params.theme).then
          ((result) => core.debug(result),
          (err) => console.error(err)
          );
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

var action = core.getInput('action')
if(shopifyStore == '' || apiKey == '' || apiSecret == '' || themeName == '') {
  console.log(`Variable missing:
    must set environment variables for
    SHOPIFY_STORE
    SHOPIFY_API_KEY
    SHOPIFY_API_SECRET
    SHOPIFY_THEME_NAME`)
  process.exit(-1)
}
if (process.argv.length > 3) {
    console.log("Usage: " + __filename + " <get|publish|delete>");
    console.log("Uses SHOPIFY_THEME_NAME environment variable for fetching the theme id");
    process.exit(-1);
}

// First try to set action variable if in GitHub Actions environment
// else set it from command line argument
if (!action) {
  action = process.argv.slice(2);
}

run(action)
