## Deploy `staging` branch to [Heroku](https://skionetizymvp-staging.herokuapp.com/)

### pull origin
    git pull origin

### Checkout `staging`

    git checkout staging

### Create Heroku Remote
    heroku git:remote  -a skionetizymvp-staging

### Push to Heroku
    git push heroku staging:main