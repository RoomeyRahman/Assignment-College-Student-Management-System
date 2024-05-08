<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

### User Create

- **Method:** POST
- **Route:** /users
- **Authentication:** false
- **Body:**

  ```json
  {
    "email": "roomey@gmail.com",
    "password": "12345"
  }
  ```

- **Response:**

```json
{
  "status": "SUCCESS",
  "data": {
    "_id": "663bc7bb47a8bb4e7dc363d6",
    "email": "roomey@gmail.com",
    "isActive": true,
    "isVerified": false,
    "isAdmin": false,
    "isSuperAdmin": false,
    "cTime": 1715193584252
  },
  "message": "",
  "pagination": null
}
```

### User Login

- **Method:** POST
- **Route:** /login
- **Authentication:** false
- **Body:**

  ```json
  {
    "email": "roomey@gmail.com",
    "password": "12345"
  }
  ```

- **Response:**

```json
{
  "_id": "663bc7bb47a8bb4e7dc363d6",
  "email": "roomey@gmail.com",
  "isAdmin": false,
  "isSuperAdmin": false
}
```

- **Header:**

```json
{
  "X-ACCESS-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNiYzdiYjQ3YThiYjRlN2RjMzYzZDYiLCJlbWFpbCI6InJvb21leUBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaXNTdXBlckFkbWluIjpmYWxzZSwiaWF0IjoxNzE1MTkzODM0LCJleHAiOjIzMTk5OTM4MzR9.KsnV0lBARbf-KykYCnFeqUNh2kp7_mlxT6uwRVyVXmk",
  "X-ACCESS-KEY-EXPIRES": "604800000"
}
```

### Student Create

- **Method:** POST
- **Route:** /students
- **Authentication:** true [provide bearer token]
- **Body:**

  ```json
  {
    "studentId": "1",
    "name": "Ataur Rahman",
    "age": 24,
    "gender": "Male",
    "course": "CSE",
    "hobby": "gardening",
    "admissionDate": 1389526564
  }
  ```

- **Response:**

```json
{
  "status": "SUCCESS",
  "data": {
    "isActive": true,
    "isDeleted": false,
    "cTime": 1715193962374,
    "cBy": "663a8659ed8d34691a32a261",
    "studentId": "5",
    "name": "Ataur Rahman",
    "age": 24,
    "gender": "Male",
    "course": "CSE",
    "hobby": "gardening",
    "admissionDate": 1389526564,
    "_id": "663bc86a47a8bb4e7dc363da",
    "__v": 0,
    "id": "663bc86a47a8bb4e7dc363da"
  },
  "message": "",
  "pagination": null
}
```

### Student Update

- **Method:** PATCH
- **Route:** /students/<id>
- **Authentication:** true [provide bearer token]
- **Body:**

  ```json
  {
    "name": "Md Ataur Rahman"
  }
  ```

- **Response:**

```json
{
  "status": "SUCCESS",
  "data": {
    "isActive": true,
    "isDeleted": false,
    "cTime": 1715193962374,
    "cBy": "663a8659ed8d34691a32a261",
    "studentId": "5",
    "name": "Md Ataur Rahman",
    "age": 24,
    "gender": "Male",
    "course": "CSE",
    "hobby": "gardening",
    "admissionDate": 1389526564,
    "_id": "663bc86a47a8bb4e7dc363da",
    "__v": 0,
    "id": "663bc86a47a8bb4e7dc363da"
  },
  "message": "",
  "pagination": null
}
```

### Student FindAll

- **Method:** GET
- **Route:** /students
- **Authentication:** true [provide bearer token]
- **Query:**

  ```json
  {
    "pagination": true
  }
  ```

- **Response:**

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "_id": "663bc86a47a8bb4e7dc363da",
      "isActive": true,
      "isDeleted": false,
      "cTime": 1715193962374,
      "cBy": "663a8659ed8d34691a32a261",
      "studentId": "5",
      "name": "Ataur Rahman",
      "age": 24,
      "gender": "Male",
      "course": "CSE",
      "hobby": "gardening",
      "admissionDate": 1389526564,
      "__v": 0,
      "id": "663bc86a47a8bb4e7dc363da"
    }
  ],
  "message": "",
  "pagination": {
    "total": 1,
    "limit": 1,
    "skip": 0
  }
}
```

### Student FindOne

- **Method:** GET
- **Route:** /students/<id>
- **Authentication:** true [provide bearer token]
- **Response:**

```json
{
  "status": "SUCCESS",
  "data": {
    "isActive": true,
    "isDeleted": false,
    "cTime": 1715193962374,
    "cBy": "663a8659ed8d34691a32a261",
    "studentId": "5",
    "name": "Md Ataur Rahman",
    "age": 24,
    "gender": "Male",
    "course": "CSE",
    "hobby": "gardening",
    "admissionDate": 1389526564,
    "_id": "663bc86a47a8bb4e7dc363da",
    "__v": 0,
    "id": "663bc86a47a8bb4e7dc363da"
  },
  "message": "",
  "pagination": null
}
```

### Student Delete

- **Method:** DELETE
- **Route:** /students/<>
- **Authentication:** true [provide bearer token]

- **Response:**

```json
{
  "status": "SUCCESS",
  "data": "successfully deleted",
  "message": "",
  "pagination": null
}
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
