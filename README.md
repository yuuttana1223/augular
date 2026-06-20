# augular

Angular + Claude Code セットアップ用リポジトリ。

## Claude Code 設定

### MCP サーバー

`.claude/settings.json` に Angular CLI MCP サーバーが設定済み。

**初回セットアップ時は以下のコマンドで登録が必要：**

```bash
claude mcp add angular-cli -- npx -y @angular/cli mcp
```

> `settings.json` を手動編集するだけでは認識されない。`claude mcp add` コマンドで正式に登録する必要がある。

動作確認は `/mcp` コマンドで確認できる。

## ファイル構成

| ファイル | 用途 |
|--------|------|
| `CLAUDE.md` | Claude Code 向け Angular/TypeScript コーディングルール |
| `.claude/settings.json` | Claude Code MCP サーバー設定（`ng mcp` 自動起動） |
