# Send by Pass

Send by Pass is a platform for sending packages abroad with a reasonable price safely.

## Using Docker and Makefile

### Development environment - for doing testing

```
make build-development
make start-development
```

Open http://localhost:3001

### Staging environment - for doing UAT testing

```
make build-staging
make start-staging
```

Open http://localhost:3002

### Production environment - for users

```
make build-production
make start-production
```

Open http://localhost:3003

## Running Locally

```
npm install -g pnpm
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.