<center>
  <img src="qinterest/static/logo.png"></img>
  <h1>qinterest</h1>
</center>


## Quickstart

#### Prerequsites
- Python 3.7+
- Memcached
- Make
- Unix-like system (Running on Windows untested)
- Database (one of: SQLite, MariaDB/MySQL, Postgres, SQL Server)
- Node (development)
- GitHub client ID and Secret

#### 1. Create a file called `.env` in project root

```
export MEMCACHE_IP=localhost
export MEMCACHE_PORT=11211
export FLASK_SECRET_KEY=secret_123_key
export GITHUB_CLIENT_ID=123xyz
export GITHUB_CLIENT_SECRET=xyz789
export SQLALCHEMY_DATABASE_URI=sqlite:///database.db
export APP_IP=0.0.0.0
export APP_PORT=5000
export FLASK_APP=qinterest
export FLASK_ENV=production
```

#### 2. `make install`

#### 3. `make init` (initialize database)

#### 4. `make gunicorn` (start WSGI server)

<br/>

## Design Decisions
- Database: SQL
- Backend: Python, Flask, SQLAlchemy
- Frontend: JavaScript, React, Redux
- Testing: Pytest (Backend), Jest (frontend), React-Testing-Library (frontend)

#### Database
There are two tables: one for users and another for pins. To keep things simple,
short-urls for pins are stored as an indexed-column on the pins table.

```
CREATE TABLE pin (
	id INTEGER NOT NULL,
	url TEXT,
	short VARCHAR(8) NOT NULL,
	username INTEGER NOT NULL,
	PRIMARY KEY (id), FOREIGN KEY(username) REFERENCES user (name)
)

CREATE TABLE user (
	name VARCHAR(255) NOT NULL,
	github_access_token VARCHAR(255),
	avatar VARCHAR(512), PRIMARY KEY (name)
)
```

The alternative to storing short-urls in the pins table would be to have them stored in a
separate table and reference them from the pins table. Additionally, but with added
complexity, we could also support on-the-fly short-url generation that could also expire
after some specified amount of time.

#### API
There are two REST endpoints: `GET /api/user` and  `(GET|POST|DELETE) /api/pin` .

#### Brief synopsis of the endpoints
Example: `GET /api/user/francium`
```
{
  "avatar": "https://avatars0.githubusercontent.com/u/15352422?v=4",
  "name": "francium"
}
```

Example: `GET /api/user/randomUser34534`
```
{
  "error": 404
}
```

Example: `GET /api/pin?limit=10&offset=20` (get 10 pins starting at the 20th entry)
```
[
  {
    "id": 20113,
    "short": "30912",
    "url": "...",
    "user_avatar": "...",
    "username": "francium"
  },
  ...
  {
    "id": 20104,
    "short": "32527",
    "url": "...",
    "user_avatar": "...",
    "username": "francium"
  }
]
```

Example: `DELETE /api/pin?id=123`
```
200 OK
```

Example: `DELETE /api/pin?id=123`
```
200 OK
```

Example: `POST /api/pin`
```
// payload
{url: '...'}

// response
{
  "id": 20105,
  "short": "12547",
  "url": "...",
  "user_avatar": "...",
  "username": "francium"
}
```

#### Server-Side Rendering
The server renders a basic HTML template and injects initial data into the template to
avoid having to make an additional request to get data to render. This initial data is a
JSON object containing things like: currently logged in user, initial set of pins to
render on the given page, information about a given user if on their profile
(`/user/francium`).

#### Caching
In addition to browser caching, the server will cache (currently) pin data after it is
first requested into a Memcached instance. The cache becomes invalidated as soon as a pin
is deleted or inserted.

<br/>

## Scaling and Performance
- Any attempt to improve performance should be driven by careful profiling and usage data
  to ensure performance bottlenecks are being targeted to achieve maximum performance
  gains
- Memcached has already been integrated to cache some common bottleneck areas and avoid
  going to the database on every request -- namely data for rendering front page and
  infinite scrolling
  - Additional caching can be setup as new bottlenecks are identified based on usage
    patterns
- Currently, primarily for small-scale development, a SQLite database has been used which
  is an obvious bottleneck. For production ready deployments, a more scalable database
  such as Postgres should be used for improved performance
- For increased work loads, load-balancers can be setup to distribute the workload across
  multiple machines, but due to the IO-bound nature of the request, such an approach may
  not provide significant performance gains if the IO is the bottleneck
- Browsers are able to cache some resources, but a server-side cache such as Varnish may
  provide some additional performance gains (but will need to be evaluated)

<br/>

## Next Steps
- Use higher-order components to reduce duplication in frontend code
- Clean up classnames and ids to make them more consistent
- Refactor CSS rules to reduce duplication, extract common styles into reusable classes
- Integration testing (Cypress)
- The deployment process can be improved to enable continuous delivery and integration
  - Requires setting up infrastructure: build server to run automated tests and
    tools to make it easier to manage deployments upon successful builds
- Setup redundant and backup infrastructure to store database backups regularly to allow
  for disaster recovery and handling of traffic spikes
- Increase test coverage on backend and frontend code

<br/>

## Development

- Create an `.env` file (see Quickstart section above)
- Change the FLASK_ENV environment variable in the `.env` file to `development`
- Install python development requirements using `make install-dev`.
- Build frontend code using `make frontend-watch` (hot-reload enabled).
- Run backend in development mode using `make run` (hot-reloading enabled).
- Run tests using `make test-server` (or `make test-server-watch`) and `make test-ui` (or
  `make test-ui-watch`).
- Format code using `make format`.
- Package whole application into a tarball into a `dist/` directory using `make package`.
