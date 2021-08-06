# Medical Dashboard

## TL;DR 

Make sure you have these installed:

- Node

### Installation 

```sh
git clone https://github.com/henriqueinonhe/medical-dashboard
cd medical-dashboard
npm ci
```

### Configuration

Configure environment variables.

- Copy `.env-sample` contents to `.env`.

### Running

Make sure port 8080 is available.

For development:
```sh
npm run dev-start
```

For "production-like" environment:

```sh
npm run prod-start
```

## Table of Contents
- [1 Stack](#1-stack)
- [2 Pre Requisites](#2-pre-requisites)
- [3 Installation](#3-installation)
- [4 Configuration](#4-configuration)
- [5 Running](#5-running)
- [6 Linting](#6-linting)
- [7 Testing](#7-testing)


## 1 Stack


- Language: [Typescript](https://www.typescriptlang.org/)
- Framework: [React](https://reactjs.org/)
- CSS in JS: [Styled Components](https://styled-components.com/)
- Bundler: [Webpack](https://webpack.js.org/)
- Linter: [ESLint](https://eslint.org)
- Tests: [Jest](https://jestjs.io/)
- UI Tests: [Cypress](https://docs.cypress.io/)

## 2 Pre Requisites

- [Node/NPM](https://nodejs.org/en/)

## 3 Installation

Clone the project:

```sh
git clone https://github.com/henriqueinonhe/medical-dashboard
```

## 4 Configuration

There are two environment variables:

- **API_BASE_URL** - Self explanatory
- **TEST_ENVIRONMENT** - Must be set to true when running cypress tests.

## 5 Running

For a development environment:

```sh
npm run dev-start
```

For a production-like environment:

```sh
npm run prod-start
```

This one is much more performant however takes much longer to compile and thus much longer to iterate, so it is mostly used for profiling purposes.

## 6 Linting

To run the linter:
```sh
npx eslint .
```

## 7 Testing

There are mostly UI integration tests, where the API is mocked, but aside that, everything runs pretty much "in the flesh".

To run unit tests:

```
npx jest
```

To run UI Integration tests, you may either run them in headless mode

```sh
npx cypress run
```

or in a headed mode:

```sh
npx cypress open
```

(It's cooler to use the headed mode to see things happening for real)


