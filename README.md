# Wedding
Code for wedding website using a template purchased from [Theme Forest](https://themeforest.net/item/union-wedding-template-with-page-builder/10450812).  This website uses Node.js, Express, and MongoDB. 

### Preview
To see a preview of what an invite will look link, [click here](https://brittaniandriley.com/invite/d38abbd0-d2aa-11eb-bb7c-45f47554a212)

### Dev Env
**Start Mongo Server**
```
mongod --dbpath ~/data/db
```

**Start Node Server**
```
nodemon src
```

### Deploy
**Build Docker Image**
```
docker build -t wedding .
```

**Create Docker Network**
```
docker network create wedding_app
```

**Spin Up Container**
```
docker-compose up
```

