ccfs14
======

CitySensing project for Fuorisalone 2014

##Installation
If you want to run your instance of ccfs14 locally on your machine, be sure you have the following requirements installed.

###Requirements

- [Git](http://git-scm.com/book/en/Getting-Started-Installing-Git)
- [Node](http://nodejs.org/)
- [Bower](http://bower.io/#installing-bower)


Clone ccfs14 from the command line:

``` sh
$ git clone https://github.com/densitydesign/ccfs14.git
```

browse to ccfs14 root folder:

``` sh
$ cd ccfs14
```

browse to ccfs14 server root folder:

``` sh
$ cd ccfs14/server
```

install node modules:

``` sh
$ npm install
```

browse back to ccfs14 root folder:

``` sh
$ cd ..
```

browse to ccfs14 client root folder:

``` sh
$ cd ccfs14/client
```

install client-side dependencies:

``` sh
$ bower install
```

Run ccfs14 Node server:

``` sh
$ cd ccfs14/server
```

``` sh
$ node ccfs.server.js
```

You can now run ccfs14 from your local web server. For example, you can run Python's built-in server:

``` sh
$ python -m SimpleHTTPServer 4000
```

or for Python 3+

``` sh
$ python -m http.server 4000
```

Once this is running, go to [http://localhost:4000/](http://localhost:4000/)
