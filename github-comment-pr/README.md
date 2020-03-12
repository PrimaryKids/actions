# Github PR comment javascript action

This action comments on the associated pull request with a provided message.

## Inputs

### `message`

**Required** The contents of the comment.

## Example usage

```
uses: PrimaryKids/actions/github-comment-pr@master
with:
  message: 'This is a new issue comment on my PR!'
```

## Building

When making changes to the index.js for this action it has to be rebuilt with ncc. See https://github.com/zeit/ncc for installation instructions and details. This tool compiles with all dependencies into a single file so we don't have to include the node_modules dir and speeds up the action.

Example: `ncc build index.js`
