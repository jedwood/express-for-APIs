Express for APIs
---

>A few tips and libraries for creating and documenting RESTful APIs with Express.js

Two things really got me sucked into Express when I first started using it: Jade and Stylus. I can barely tolerate writing HTML and CSS any other way.

These days I spend more time spend more time using Express for APIs that send nothing but JSON. In this post I'll cover a few libraries and reminders to help keep your code organized and your API friendly for developers.

## Mongoose

I'm assuming an API backed by MongoDB, and that we're using [Mongoose](http://mongoosejs.com/). Covering the basics of Mongoose is beyond the scope of this article, but I want to highlight a few lesser-known bits.

### express-mongoose

I'm generally not a flow control library guy. I guess I've just gotten used to callbacks. That said, it's worth condidering [express-mongoose](https://github.com/LearnBoost/express-mongoose) as a nice way of cleaning things up. It allows you to pass a Mongoose Query or Promise to `res.send` instead of writing out the full callback. That means a method that requires two separate Mongoose calls can be condensed to this:

        app.get('/pets', function(req, res) {
          res.send({cats: Cat.find(), dogs: Dog.find()});
        });

The fact that it supports Promises is important to keep in mind, because it means you can create some fairly complex async stuff in your Mongoose models that return a Promise, and keep the top layer routing/sending code really tidy.

### Mongoose Transforms

I often find myself wanting to "hide" certain properties of objects before they get sent across the wire. Mongoose has a great mechanism for this via  `toObject` and `toJson` Transforms. Here's an example [from the docs](http://mongoosejs.com/docs/api.html#document_Document-toObject):

        schema.options.toObject.transform = function (doc, ret, options) {
          return { movie: ret.name }
        }

        // without the transformation in the schema
        doc.toObject(); // { _id: 'anId', name: 'Wreck-it Ralph' }

        // with the transformation
        doc.toObject(); // { movie: 'Wreck-it Ralph' }

## Routing

### express-resource-new

It can be tedious writing out the same GET, POST, PUT, DELETE actions for all of your resources, and tedious can turn to messy when you start including authentication and other middleware. TJ Holowaychuk, the creator of Express, also wrote a little library called [express-resource](https://github.com/visionmedia/express-resource) that simplifies some of that. However, I prefer [express-resource-new](https://github.com/tpeden/express-resource-new) which takes things a bit further by adding "before" middleware and nicer nested resource syntax, giving you a slightly more Rails-like controller setup. Note that the version on npm is not the latest, so you'll need to run this command to install via npm:

`npm install git://github.com/tpeden/express-resource-new.git#175c2ad84cc6d3ac2b509d720b9ce583d7e8afb3`

### XHR-friendly

If you're API is really strict, it would look only at the type of call being made; a POST is a POST, a DELETE is a DELETE. That poses a problem for some browsers and front-end libraries that only use GET and POST. A standard convention for solving that is to have your server look for a `_method` parameter on the incoming data, and use that value. If you've ever copied and pasted a basic Express example, you're probably already using this:

`app.use(express.methodOverride());`

If for some reason you want your API to stay strict, just remove that line. Note that Express has a handy little [req.xhr](http://expressjs.com/api.html#req.xhr) helper that should be able to determine whether a call was made with XMLHttpRequest.

## Status codes

By default Express will automatically set the codes for most common success and error cases, but sometimes it's worth being explicit about the codes you return. You can do that using two different formats:

`res.status(500).send({error:"End of line."});`

or

`res.send(500, {error:"End of line."});`

There are plenty of long (boring) debates on the web about the finer points of when to use obscure HTTP status codes. Here are the simple conventions I usually follow:

`201` upon a successful POST/CREATE operation (people often mistakenly just use 200 for this)

`400` if the user makes a request that's not valid, such as not including a parameter in the required format

`401` if the user requests a resource without being authorized

`404` if the user requests a resource that doesn't exist

`500` if something goes wrong on the server that is not the user's fault

## Content negotiation

The "proper" way to determine whether your API should send HTML, JSON, or XML is by inspecting the `Accept` header and branching accordingly. Express has some nice helpers for this, including [req.accepts](http://expressjs.com/api.html#req.accepts) and [res.format](http://expressjs.com/api.html#res.format). If you use express-resource-new then by default you'll also be providing a "dot suffix" alternative for your users, e.g. `/people.html` and `/people.json`.

Be sure that you're explicit about the format you're returning if you need to be. Recent version of iOS can be particularly strict about this. If it's expecting JSON and you fire of a `res.status(200)` then the user is going to get a `OK` without the proper JSON header. To fix that, you can use `res.type('json')`.

## Documenting your API

If you've gone to the trouble of creating a great API, you're silly not to give it proper developer-friendly documentation. My personal favorite is [I/O Docs by Mashery](https://github.com/mashery/iodocs). You can document several APIs with one setup. Everything is configured with simple JSON config files. It's not yet compatible with Express 3, but I've created [a fork that is](https://github.com/jedwood/iodocs/tree/express3).

You should also check out [Swagger](https://github.com/wordnik/swagger-node-express), or if you prefer to have somebody else host your docs in their cloud, check out [Apiary](http://apiary.io) and [Mashape](https://www.mashape.com/).

## Beyond Express

Of course Express is not your only option. In a future post we'll be taking a look at [Hapi.js](http://hapijs.com/), which proudly carries the "configuration over convention" banner.



