# 環境構築メモ

## Node.js バージョン管理（nvm）

Angular CLI は最低バージョンが決まっているため、古い Node.js では動かない。

```bash
# バージョン確認
node --version

# nvm で最新の v22 系をインストール
nvm install 22

# デフォルトに設定（新しいシェルでも有効になる）
nvm alias default 22
```

> `nvm alias default` を設定しないと、新しいターミナルを開くたびに古いバージョンに戻る。

---

## Angular CLI MCP サーバー（Claude Code 連携）

`.claude/settings.json` を手動編集するだけでは MCP サーバーが認識されない。  
必ず以下のコマンドで登録する：

```bash
claude mcp add angular-cli -- npx -y @angular/cli mcp
```

接続確認は `/mcp` コマンドで行う。
