users
POST /signup - everyone
POST /login - everyone
GET /user/:id - user
GET /user/:id/full - user
PUT /user/:id - user
GET /user - admin
pets
POST /pet - admin
GET /pet/:id - everyone
PUT /pet/:id - admin
GET /pet - everyone
POST /pet/:id/adopt - user
POST /pet/:id/return - user
POST /pet/:id/save - user
DELETE /pet/:id/save - user
GET /pet/user/:id - user

DELETE /pet/:id - admin
