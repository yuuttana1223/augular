# Angular 基礎

## テンプレート構文の早見表

HTML の属性と Angular 独自の記法が混在するので最初は混乱しやすい。見分けるコツ：

| 書き方 | 種類 | 例 |
|---|---|---|
| 普通の HTML 属性 | HTML | `class="btn"` `type="button"` |
| `{{ }}` | 値の表示（補間） | `{{ name }}` |
| `[attr]="..."` | JS の値をバインド | `[src]="photo"` |
| `(event)="..."` | イベント購読 | `(click)="fn()"` |
| `#name` | テンプレート参照変数 | `#filter` |
| `@if` `@for` | 制御フロー | `@if (show) { }` |

- `[]` → TypeScript の値が入る
- `()` → イベント
- `#` → 名前をつける
- `@` → 制御フロー
- それ以外 → 普通の HTML

---

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

## import と imports の違い

| | `import` | `imports` |
|---|---|---|
| 種類 | TypeScript の構文 | Angular の設定 |
| 役割 | ファイルにクラスを読み込む | テンプレートで使えるようにする |

`import` で読み込んだだけではテンプレートで使えない。`imports` に追加して初めて動く。

```typescript
import { RouterOutlet } from "@angular/router";  // 読み込むだけ

@Component({
  imports: [RouterOutlet],  // これで <router-outlet /> がテンプレートで使える
})
```

---

## ルーティング

`src/app/routes.ts` でパスとコンポーネントを対応付ける。

```typescript
const routeConfig: Routes = [
  { path: "",           component: Home },    // localhost:4200/
  { path: "details/:id", component: Details }, // localhost:4200/details/1
];
```

テンプレートでのリンクは `[routerLink]` を使う（`<a href>` と違いページ全体をリロードしない）：

```html
<!-- 固定パスは文字列でも書ける -->
<a routerLink="/">トップへ</a>

<!-- 動的な値がある場合は配列で渡す -->
<a [routerLink]="['/details', housingLocation.id]">詳細へ</a>

<!-- 複数セグメントも渡せる -->
<a [routerLink]="['/users', userId, 'posts', postId]">
```

配列の各要素がパスのセグメントになる。React Router のテンプレートリテラル（`` `/details/${id}` ``）に相当するが、Angular テンプレートではバッククォートが使えないため配列が慣習。

画面の表示場所は `<router-outlet />` で指定する。

### Angular テンプレートで使えない構文

バッククォート・`new`・`typeof` などは使えない。シンプルな式のみ。

```html
<!-- NG -->
<a [routerLink]="`/details/${id}`">

<!-- OK -->
<a [routerLink]="['/details', id]">
```

---

## コンストラクタ vs プロパティ直接代入

単純な代入だけならコンストラクタなしの方がシンプル。クラスフィールドは宣言順に初期化されるので、上で宣言したプロパティを下で参照できる。

```typescript
// コンストラクタあり（冗長）
export class Details {
  route = inject(ActivatedRoute);
  housingLocationId = -1;
  constructor() {
    this.housingLocationId = Number(this.route.snapshot.params['id']);
  }
}

// プロパティ直接代入（シンプル）
export class Details {
  route = inject(ActivatedRoute);
  housingLocationId = Number(this.route.snapshot.params['id']);
}
```

コンストラクタが必要な場面：複雑な条件分岐・複数処理をまとめたい場合。

---

## Angular の得意・不得意

**得意：**
- 大規模な業務システム・管理画面
- チーム開発（型安全・規約が厳格でブレにくい）
- エンタープライズ向けアプリ（Google Ads など Google 自身が使用）

**不得意：**
- toC 向けサービス・コンテンツサイト（Next.js / Astro が向いている）
- SEO 重視のサイト（SPA のため初期 HTML がほぼ空）

「全部入り（ルーター・HttpClient・フォームが標準装備）」で大規模でも統一的に書けるのが強みだが、その分重厚で学習コストが高い。

---

## SSR / SSG

Angular の SPA は初期 HTML がほぼ空なので SEO に弱い。対策：

| 方法 | 内容 |
|---|---|
| Angular SSR（v17以降） | `ng add @angular/ssr` で公式対応。SEO 重視のアプリに |
| Analog | Angular の Next.js 的フレームワーク。SSR・SSG・ファイルベースルーティング対応 |

SSG が必要なら Analog が本命。ただし Angular でコンテンツサイトを作ること自体が少ない。

---

## カスタムタグが DOM に残る

Angular コンポーネントは `selector` に指定した名前がそのまま DOM に出力される。

```html
<app-root>
  <app-home>
    <app-housing-location>...</app-housing-location>
  </app-home>
</app-root>
```

React は仮想 DOM でコンポーネントタグが DOM に残らないが、Angular はカスタム要素として残る。ブラウザは未知のタグを無視して中身を表示するので動作上は問題ない。DevTools でコンポーネントの階層がそのまま見えるのでデバッグしやすい。

SEO への影響はタグ名ではなく SPA 全般の問題（JS 実行前はコンテンツが空）。

---

## HttpClient

Angular の HTTP クライアント。`fetch` の代わりに使う。実務ではこちらが一般的。

```typescript
http = inject(HttpClient);

getAllHousingLocations() {
  return this.http.get<HousingLocationInfo[]>(this.url); // Observable を返す
}
```

`fetch` との違い：インターセプター（認証トークンの自動付与など）が使える、RxJS でエラーハンドリングを統一できる、テストがしやすい。

---

## ChangeDetectorRef と変更検知

Angular は通常データが変わると自動で画面を更新するが、`Promise` で非同期取得した場合は検知できないことがある。その場合 `markForCheck()` で手動通知が必要。

```typescript
changeDetectorRef = inject(ChangeDetectorRef);

.then((data) => {
  this.list = data;
  this.changeDetectorRef.markForCheck(); // 「画面を更新して」と伝える
});
```

### markForCheck() を使わずに済む方法

| 方法 | 説明 |
|---|---|
| Signal の `set()` | 変更を自動追跡するので不要 |
| `async` パイプ | Observable を自動購読・変更検知 |

Signal を使うのが現在の推奨。`markForCheck()` を書く機会は減っている。

---

## テンプレート参照変数（#変数名）

`#` で DOM 要素に名前をつけてテンプレート内から参照できる。クラス（TypeScript）からは参照できず、テンプレート内だけで使える。

```html
<input type="text" #filter />
<button (click)="filterResults(filter.value)">Search</button>
```

React の `useRef` に相当するが、テンプレート内で完結するので ref を渡す必要がない。

```tsx
// React
const filterRef = useRef<HTMLInputElement>(null);
<button onClick={() => filterResults(filterRef.current?.value)}>

// Angular → テンプレート内で直接参照
<input #filter />
<button (click)="filterResults(filter.value)">
```

---

## イベントバインディング（(click) など）

`(イベント名)="メソッド()"` でイベントを購読する。

```html
<button (click)="filterResults(filter.value)">Search</button>
```

React の `onClick={...}` に相当。

---

## Reactive Forms（フォーム）

`FormGroup` と `FormControl` でフォームを定義する。

```typescript
import { FormControl, FormGroup, Validators } from '@angular/forms';

applyForm = new FormGroup({
  firstName: new FormControl("", [Validators.required]),
  email: new FormControl("", [Validators.required, Validators.email]),
});
```

### 値の取得

フォームの値は一つずつ取り出す方が型安全。`?? ""` でデフォルト値を当てると `string` として扱える。

```typescript
// 一つずつ取り出す（推奨）
this.applyForm.value.firstName ?? ""

// スプレッドでまとめて渡すと型が string | null になる → サービス側の型が複雑になる
```

### バリデーション

```typescript
submitApplication() {
  if (this.applyForm.invalid) return;  // 無効なら弾く
  ...
}
```

テンプレートでエラー表示：

```html
@if (applyForm.controls.email.hasError('required') && applyForm.controls.email.touched) {
  <p>メールアドレスは必須です</p>
}
```

### スキーマバリデーション（Zod など）

Angular 組み込みには Zod のようなスキーマバリデーションはない。カスタムバリデータとして組み合わせることは可能だが、一般的ではない。まずは組み込み `Validators` を使う。

---

## @if による条件分岐

React の三項演算子に相当。

```html
@if (housingLocation) {
  <p>{{ housingLocation.name }}</p>
} @else {
  <p>物件が見つかりません</p>
}
```

### null チェックの使い分け

| ケース | 書き方 |
|---|---|
| オブジェクト・配列の存在チェック | `@if (item)` で十分 |
| 数値・文字列で `0` や `""` が有効な値 | `@if (item != null)` で統一 |

`!= null` は `null` と `undefined` の両方を弾く。全部厳密比較（`!== undefined && !== null`）にすると冗長なので `!= null` が現実的なバランス。

---

## output() と emit（子 → 親へのデータ送信）

子コンポーネントから親へデータを渡す仕組み。React のコールバック props に相当。

```typescript
// 子コンポーネント
export class HousingLocation {
  clicked = output<string>();  // output() で定義

  onClick() {
    this.clicked.emit('クリックされた値');  // emit で発火
  }
}
```

```html
<!-- 親テンプレート → (イベント名) で購読 -->
<app-housing-location (clicked)="handleClick($event)" />
```

```typescript
// 親コンポーネント
handleClick(value: string) {
  console.log(value); // 'クリックされた値'
}
```

`$event` が emit で渡した値。

React との比較：

```tsx
// React → コールバック関数を props で渡す
<HousingLocation onClick={(value) => handleClick(value)} />

// Angular → output() + (イベント名) で購読
<app-housing-location (clicked)="handleClick($event)" />
```

### React と Angular の設計思想の違い

結果は同じだが責務の置き方が異なる。

| | Angular（emit） | React（コールバック） |
|---|---|---|
| 子がすること | 値を「送る」だけ | 親から渡された関数を呼ぶ |
| 親がすること | 受け取って自分で更新 | 更新ロジックを関数として子に渡す |
| 子は親を知るか | 知らない（疎結合） | 親の関数を持っている |

Angular はより「イベント駆動」的。子は「こういう値が出たよ」と通知するだけで、親が何をするかは関知しない。

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

### @Service（v22以降）

`@Injectable({ providedIn: 'root' })` の短縮形として v22 で追加。

```typescript
import { Service } from '@angular/core';

@Service()
export class AnalyticsLogger { ... }
```

v21 以前では使えないので `@Injectable` を使う。

### providedIn: 'root'

`@Injectable({ providedIn: 'root' })` でアプリ全体のシングルトンとして登録。どのコンポーネントから `inject()` しても同じインスタンスが返る。

**使う場面：** API 通信・認証・グローバルなデータ管理など  
**基本的にサービスは `providedIn: 'root'` でほぼ問題ない。**

### サービスは責務ごとに複数作る

1サービス1責務が基本。React のカスタムフックを分けるのと同じ考え方。

```
src/app/
├── housing.ts     # 物件データ
├── auth.ts        # 認証
└── user.ts        # ユーザー情報
```

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
