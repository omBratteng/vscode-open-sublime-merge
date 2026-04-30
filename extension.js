const vscode = require('vscode')
const cp = require('child_process')

const getRepoRoot = (uri) => {
  const git = vscode.extensions.getExtension('vscode.git')?.exports.getAPI(1)
  const repo = git?.getRepository(uri) ?? git?.repositories[0]
  return repo?.rootUri.fsPath
}

const openInSublimeMerge = async (uri) => {
  const target =
    uri ??
    vscode.window.activeTextEditor?.document.uri ??
    vscode.workspace.workspaceFolders?.[0]?.uri
  if (!target) return

  const root = getRepoRoot(target)
  if (!root) {
    vscode.window.showErrorMessage('No git repo found.')
    return
  }

  const cmd = process.platform === 'darwin'
    ? `open -a "Sublime Merge" "${root}"`
    : `smerge "${root}"`
  cp.exec(cmd)
}

const activate = (ctx) => {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('openInSublimeMerge.open', openInSublimeMerge)
  )
}

module.exports = { activate, deactivate: () => {} }
