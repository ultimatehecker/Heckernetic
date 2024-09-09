<h1>
    <p align="center">
        <br>Heckernetic
    </h1>
<p align="center">A simple discord bot which solves your needs <br /> </p>
</p>

<p align="center">
  <a href="#about-the-project">About The Project</a> •
  <a href="#installation">Installation</a>
</p>  

## About The Project
Heckernetic is the continuation and rewrite of Cybernetic, which now implements more modern and readble code to be able to test and produce on a
small. This includes also many new features that Cybernetic never had, which includes a leveling system, new general commands, and in the future will 
hopefully interact with the Hypixel API and Ergast API to make their own hypixel and formula racing commands respectively.

## Installation
To install this library, you will need to already have `Node.js` installed in addition to having an npm version of at least `>=16.6`. You will need
to also clone the repository:

```sh
git clone https://github.com/ultimatehecker/Heckernetic.git
```

After that is done, using your code editor or the terminal, you need to install all of the packages

```sh
npm install
```

Now that everything is setup, you will need to create a `.env` file to store all of Heckernetics environment variables. There is a `.env.example` that
shows what each name of the environment variable and what to insert there. This is where you will also need to create a discord bot through the Discord
Developers Portal, as Heckernetic's token is not public, therefore you will need to make a copy of it. After all your environment variables are set, you can run the bot

```sh
node . -d
```