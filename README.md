# 🐝 GBee App 🔸🔸🔸

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI or GitHub Action. It includes the following files and folders.


## Launching Locally
If you want to run a project local with sam emulation run directly script file (in root of project folders): 
```bash
./local
``` 

Also, you can just run dev command in app folder (`/app`)
```bash
npm run dev
```

## Unit tests

Tests are defined in the `app/tests` folder in this project. Use NPM to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
cd app
npm install
npm run test
```

## Deployment
### Setup env with GitHub Action

Add your environment variables on your GitHub Action Secret before deployment

- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- DATABASE_URL
- DEFAULT_USER_EMAIL
- DEFAULT_USER_NAME
- DEFAULT_USER_PASSWORD
- JWT_SECRET
