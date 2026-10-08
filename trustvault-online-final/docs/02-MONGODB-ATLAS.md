# MongoDB Atlas — easy setup

MongoDB Atlas is the online database. Your laptop does not have to stay on.

MongoDB documents Free Clusters as a no-cost option for learning, prototyping and workloads that fit the free limits. urlMongoDB cluster docshttps://www.mongodb.com/docs/atlas/manage-clusters/

## 1. Create an Atlas account and project

Create a new project named:

```text
TrustVault
```

## 2. Create a Free Cluster

Choose the Free Cluster option available in your Atlas dashboard.

## 3. Create a database user

Example:

```text
Username: trustvaultapp
Password: use-a-strong-password
```

Do not paste your password into GitHub.

## 4. Network Access

For a simple serverless demo, configure Atlas network access so your Netlify Function can connect. Atlas documentation explains IP access list configuration.

## 5. Get the connection string

It will look like:

```text
mongodb+srv://trustvaultapp:<PASSWORD>@<CLUSTER>.mongodb.net/trustvault?retryWrites=true&w=majority
```

## 6. Put it in Netlify

Netlify → Project configuration → Environment variables.

Add:

```text
MONGODB_URI
MONGODB_DB = trustvault
JWT_SECRET = a-long-secret-string
```

Then redeploy.
