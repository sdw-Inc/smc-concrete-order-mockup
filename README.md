# GitHub Pages 公開手順

このプロジェクトをGitHub Pagesで公開する手順です。

## 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログインします
2. 右上の「+」ボタンから「New repository」を選択
3. リポジトリ名を入力（例: `smc-concrete-order-mockup`）
4. 「Public」または「Private」を選択
5. 「Initialize this repository with a README」は**チェックしない**
6. 「Create repository」をクリック

## 2. GitHubリポジトリにファイルをアップロード（2つの方法から選択）

### 方法A: GitHubからクローンしたフォルダにファイルをコピーしてプッシュ（推奨）

1. GitHubでリポジトリを作成した後、リポジトリのページで緑色の「Code」ボタンをクリック
2. URLをコピー（例: `https://github.com/YOUR_USERNAME/smc-concrete-order-mockup.git`）
3. SourceTreeを開く
4. 「新規」→「URLからクローン」をクリック
5. 「ソースURL/パス」にコピーしたURLを貼り付け
6. 「保存先のパス」で保存先を選択（例: `/Users/kotakesaki/Desktop/smc-concrete-order-mockup`）
7. 「クローン」をクリック
8. クローンが完了したら、現在のプロジェクトフォルダ（`/Users/kotakesaki/Desktop/コンクリートオーダーシステム関連/smc/smc`）内の**すべてのファイルとフォルダ**を、クローンしたフォルダにコピー：
   - `index.html`
   - `common/`フォルダ
   - `js/`フォルダ
   - `line-area/`フォルダ
   - `plant-area/`フォルダ
   - `main.css`
   - `.gitignore`
   - `README.md`
   - その他のファイル
   - **注意**: `.git`フォルダはコピーしないでください
9. SourceTreeでクローンしたリポジトリを開く
10. 下部の「作業ツリーの変更」タブで、コピーしたファイルが表示されていることを確認
11. すべてのファイルを選択（Command+A または Ctrl+A）
12. 右下の「ステージング」ボタンをクリック
13. 下部の「コミットメッセージ」欄に「Initial commit」と入力
14. 「コミット」ボタンをクリック
15. 上部の「プッシュ」ボタンをクリック
16. 「リモート」で `origin` を選択
17. 「ブランチ」で `main` を選択（または `master` が表示される場合は `master`）
18. 「プッシュ」をクリック

### 方法B: SourceTreeで新規リポジトリを作成してGitHubに接続

#### ステップ1: SourceTreeでリポジトリを作成

1. SourceTreeを開く
2. 「新規」→「ローカルリポジトリを作成」をクリック
3. 「作成先のパス」で「参照」をクリックし、プロジェクトフォルダを選択：
   `/Users/kotakesaki/Desktop/コンクリートオーダーシステム関連/smc/smc`
4. 「リポジトリ名」に任意の名前を入力（例: `smc-concrete-order-mockup`）
5. 「作成」をクリック

#### ステップ2: ファイルをステージングしてコミット

1. SourceTreeの左側で作成したリポジトリを選択
2. 下部の「作業ツリーの変更」タブで、すべてのファイルが表示されていることを確認
3. すべてのファイルを選択（Command+A または Ctrl+A）
4. 右下の「ステージング」ボタンをクリック（またはファイルを右クリック→「ステージング」）
5. 下部の「コミットメッセージ」欄に「Initial commit」と入力
6. 「コミット」ボタンをクリック

#### ステップ3: GitHubリポジトリに接続してプッシュ

1. SourceTreeの上部メニューで「リモート」→「追加」をクリック
2. 「リモート名」に `origin` と入力
3. 「URL/パス」にGitHubで作成したリポジトリのURLを入力：
   `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
   （YOUR_USERNAMEとYOUR_REPO_NAMEを実際の値に置き換え）
4. 「OK」をクリック
5. 上部の「プッシュ」ボタンをクリック
6. 「リモート」で `origin` を選択
7. 「ブランチ」で `main` を選択（または `master` が表示される場合は `master`）
8. 「プッシュ」をクリック

### 補足: GitHubのWebインターフェースで直接アップロードする方法

SourceTreeを使わない場合は、以下の方法も可能です：

1. GitHubで作成したリポジトリのページで「uploading an existing file」をクリック
2. プロジェクトフォルダ内のすべてのファイルとフォルダをドラッグ&ドロップ
3. 下にスクロールして「Commit changes」をクリック

## 4. GitHub Pagesの設定

1. GitHubリポジトリのページで「Settings」タブをクリック
2. 左サイドバーから「Pages」を選択
3. 「Source」セクションで：
   - 「Deploy from a branch」を選択
   - 「Branch」で「main」を選択
   - 「/ (root)」を選択
   - 「Save」をクリック

## 5. 公開URLの確認

数分待つと、以下のURLでサイトにアクセスできます：

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

例：`https://kotakesaki.github.io/smc-concrete-order-mockup/`

## 6. 更新方法

### SourceTreeを使う場合：
1. SourceTreeでリポジトリを開く
2. ファイルを編集した後、SourceTreeに戻ると「作業ツリーの変更」に変更されたファイルが表示されます
3. 変更されたファイルを選択して「ステージング」ボタンをクリック
4. 下部の「コミットメッセージ」欄に変更内容を入力（例: 「Update files」）
5. 「コミット」ボタンをクリック
6. 上部の「プッシュ」ボタンをクリックしてGitHubに反映

### Webインターフェースを使う場合：
1. GitHubリポジトリのページでファイルをクリック
2. 鉛筆アイコン（Edit）をクリック
3. ファイルを編集
4. 下にスクロールして「Commit changes」をクリック

GitHub Pagesは自動的に再デプロイされます（数分かかる場合があります）。

## 注意事項

- 公開URLは数分かかって反映される場合があります
- `index.html`がルートディレクトリにあることを確認してください（既にあります）
- プライベートリポジトリでもGitHub Pagesは使用できますが、有料プランが必要です

