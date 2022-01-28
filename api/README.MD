# quiz api

## How to start

Run migration with `yarn migrate up`

## authentication

This project integrate auth0, so we need to have proper setup:

- Create an account of auth0 (obviously)
- Create an API and turn on RBAC (role based access control)
- Then create these permissions:
  - read:topics
  - create:topics
  - update:topics
  - delete:topics
  - publish:topics
  - read:quizzes
  - create:quizzes
  - update:quizzes
  - delete:quizzes
  - publish:quizzes
  - read:questions
  - create:questions
  - update:questions
  - delete:questions
- Create roles:
  - admin
  - contributor
  - user

## How to add a new API

- Put logic in `src/core`
- Put route config in `src/routes`
- Update API specs in `swagger.js`
- Run `yarn swagger-autogen`
