# Shopify theme API javascript action

This action can retrieve themes or publish/delete a single theme that is unpublished.

## Inputs

### `action`

**Required** The type of action we want to perform. Can be either 'get', 'publish', or 'delete'

## Outputs

### `themeId`

The value of the theme ID that was published or deleted

### `themeExists`

A boolean that describes if the get action returned a theme or not

## Example usage

```
uses: PrimaryKids/actions/shopify-theme-api@master
with:
  action: 'publish'
```

## Building

When making changes to the index.js for this action it has to be rebuilt with ncc. See https://github.com/zeit/ncc for installation instructions and details. This tool compiles with all dependencies into a single file so we don't have to include the node_modules dir and speeds up the action.

Example: `ncc build index.js`
