# ビルドステージ
FROM node:20-alpine AS build

WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 実行ステージ
FROM node:20-alpine AS runtime

WORKDIR /app

# 本番環境の依存関係のみをインストールするための設定
ENV NODE_ENV=production

# ビルドステージから必要なファイルをコピー
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules

# CloudRunがPORT環境変数を使用することを考慮
ENV PORT=8080

# アプリケーションを実行
CMD ["node", "build/index.js"]
