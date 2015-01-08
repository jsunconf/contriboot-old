# contriboot

Contriboot is the Contributions & Interests Application for the
JS Unconf. The database backend is a CouchDB, the web frontend
a Hapi.js Application. It is inspired by the npm registry.

## Developing

Spin up the latest CouchDB and fix the Admin-Party. Contriboot
uses `admin:admin` as credentials.

There are some commands for developing:

**The bootstrapping of a database will first try to delete any
databases with the name `contriboot_dev`**

```shell
 $ npm test               # runs the testsuite
 $ npm run bootstrap      # bootstraps a database with test data
 $ npm run dev            # bootstraps a database and starts the server
```

## Theming

The templates for the facets are located in `/templates`. You can
set your template in the `config.js`.

The css/less and JavaScript for the themes is located in `/static`.

## Deployment

Couch setup is currently not automated.
There is however `provisioning/push-views.yml`, which takes care of pushing views to an already running couch.

```
npm install -g couchapp
```

### Config

`provisioning/private/private-vars.yml`

```yaml
---
db_user: mysecretuser
db_password: mysecretpw
db_host: mycouchdb.com
db_name: contriboot

haproxy_user: myhaproxyuser
haproxy_password: myhaproxypw

```

Additionally, before deployment, run

```shell
cp config-production.js-dist config-production.js
```

and adjust it to your needs.

Don't forget to create an inventory file!

```
[app]
183.75.53.66

[loadbalancer]
188.3.1.180

```


### Setting up app servers
`ansible-playbook -i private/production app-server.yml`

### Deployment
`ansible-playbook -i private/production deploy-app-server.yml`
