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

---

## バインディング（Binding）

データをテンプレート（HTML）とコンポーネント（TypeScript）の間でつなぐ仕組み。React の props 渡しと同じ概念。

| 書き方 | 種類 | 方向 |
|---|---|---|
| `[prop]="value"` | プロパティバインディング | 親 → 子 |
| `(event)="handler()"` | イベントバインディング | 子 → 親 |
| `[(ngModel)]="value"` | 双方向バインディング | 両方向 |

```html
<!-- Angular -->
<app-housing-location [housingLocation]="housingLocation" />
```

```tsx
// React の props 渡しと同じ（[] が React の {} に相当）
<HousingLocation housingLocation={housingLocation} />
```

受け取る側は `input()` で定義する：

```typescript
// Angular
housingLocation = input.required<HousingLocationInfo>();

// React
function HousingLocation({ housingLocation }: Props) {}
```

### テンプレート内では `this` 不要

- TypeScript コード（クラス内）→ `this.housingLocation`
- テンプレート（HTML）→ `housingLocation`（Angular が自動でインスタンスをバインド）

---

## サービスと inject()

サービスはビジネスロジックを持つクラス。`@Injectable` デコレータを付けて定義する。

```typescript
@Injectable({
  providedIn: 'root',  // アプリ全体でシングルトン
})
export class Housing {
  getAllHousingLocations() { ... }
}
```

コンポーネントへの注入は `inject()` 関数を使う（公式スタイルガイドで推奨）：

```typescript
export class Home {
  housingService = inject(Housing);
  housingLocationList = this.housingService.getAllHousingLocations();
}
```

コンストラクタでの初期化だけなら、プロパティの直接代入でシンプルに書ける。

### Angular v19 以降のファイル命名

v18 以前は `housing.service.ts` / `HousingService` だったが、v19 以降は `housing.ts` / `Housing` で生成される。チュートリアルが古い場合は読み替える。

---

## @for と track

Angular の繰り返し構文。React の `.map()` + `key` に相当。

```html
@for (housingLocation of housingLocationList; track housingLocation.id) {
  <app-housing-location [housingLocation]="housingLocation" />
}
```

React との比較：

```tsx
// React
housingLocationList.map((item) => (
  <HousingLocation key={item.id} housingLocation={item} />
))
```

### track（= React の key）

リストが更新されたとき、どの要素が変わったかを Angular が特定するためのキー。React の `key` と全く同じ概念。

| 指定方法 | 使いどき |
|---|---|
| `track item.id` | ID がある場合（推奨） |
| `track $index` | ID がない場合の代替 |

`track $index` は並び替えに弱い。並び替えが起きると Angular がインデックスで判断するため、実際は移動しただけの要素も再レンダリングされる。`id` がある場合は必ず `track item.id` を使う。

**`track` は省略不可**（省略するとエラー）。

### @for の組み込み変数

`$index` は Angular が自動で用意する組み込み変数。名前は固定で、自分で定義するものではない。

| 変数 | 意味 |
|---|---|
| `$index` | 何番目か（0始まり） |
| `$first` | 最初の要素か（boolean） |
| `$last` | 最後の要素か（boolean） |
| `$even` | 偶数番目か（boolean） |
| `$odd` | 奇数番目か（boolean） |
| `$count` | 全件数 |

プロパティバインディングで子コンポーネントに渡す場合も通常の変数と同じ：

```html
@for (housingLocation of housingLocationList; track housingLocation.id) {
  <app-housing-location
    [housingLocation]="housingLocation"
    [index]="$index"
  />
}
```

---

## Signal と input()

Signal は **Angular v16 で導入された新しいリアクティビティの仕組み**。`input()` もそれに基づいており、値を読み出すときに `()` が必要。

```typescript
// 古い書き方（@Input デコレータ、v15以前）
@Input() housingLocation!: HousingLocationInfo;
// テンプレートで → {{ housingLocation.name }}

// 新しい書き方（Signal ベース、v16以降）
housingLocation = input.required<HousingLocationInfo>();
// テンプレートで → {{ housingLocation().name }}
```

React の `useState` との比較：

```typescript
// React → () 不要
const [housingLocation] = useState(...);
housingLocation.name;

// Angular Signal → () 必要
housingLocation = input.required<HousingLocationInfo>();
housingLocation().name;
```
