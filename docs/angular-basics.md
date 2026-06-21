# Angular 基礎

## ng serve

開発用ローカルサーバーを起動するコマンド。

```bash
ng serve
```

- デフォルトで `http://localhost:4200` で起動
- ファイルを変更すると自動でリビルド＆ブラウザをリロード（ホットリロード）
- 本番用ビルドではなく、開発中の動作確認に使う

---

## プロジェクト構成

| ファイル/ディレクトリ | 用途 |
|---|---|
| `src/` | アプリのソースコード |
| `src/app/app.ts` | ルートコンポーネント |
| `angular.json` | Angular CLI の設定情報 |
| `package.json` | npm パッケージの管理 |
| `tsconfig.json` | TypeScript コンパイラの設定 |
| `.angular/` | ビルドキャッシュ（自動生成） |
| `node_modules/` | インストール済みパッケージ（git 管理外） |

### .e2e について

古いドキュメントには `.e2e/` ディレクトリの説明があるが、**Angular 15 以降は `ng new` で生成されない**。  
e2e テストが必要な場合は Cypress や Playwright を別途追加する。

---

## コンポーネントの基本

```typescript
@Component({
  selector: 'app-root',   // HTML で使うタグ名
  template: `...`,        // インライン HTML
  styleUrls: ['./app.css']
})
export class App {
  title = 'homes'; // チュートリアルのテーマが不動産アプリのため
}
```

---

## styleUrls vs styles

| | `styleUrls` | `styles` |
|---|---|---|
| 書き方 | 外部CSSファイルのパスを指定 | CSS をコンポーネント内に直接書く |
| 例 | `styleUrls: ['./home.css']` | `styles: ['h1 { color: red; }']` |

**使い分けの目安：**
- CSS が 10行以下 → `styles` でインラインにまとめる
- CSS が多い・複雑 → `styleUrls` で外部ファイルに分ける

実務では `styleUrls` が主流だが、小さいコンポーネントはインラインの `styles` でまとめるとファイルが増えなくてすっきりする。

---

## NgModule

Angular v14 以前の古いアーキテクチャで、コンポーネント・サービス・パイプをグループ化して管理するクラス。

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

**Angular v17 以降は Standalone コンポーネントがデフォルトになり不要。**  
古いドキュメントや記事でよく出てくるので名前は知っておく。

---

## ng コマンドの「ng」とは

**Angular** の略。Angular CLI のコマンド名として使われている。  
前身の AngularJS（Angular 1）時代から引き継がれている。
