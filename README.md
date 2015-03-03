# Game Description
This is a implementation of a game called Twenty Eight. It also known as Trump. It is mainly played in the state of Kerala in India, where it is called Thuruppu (which is the Malayalam word for Trump). This implementation only supports the 4 player version of the game. You can read more about the rules and variations about this game in the following links.

* http://en.wikipedia.org/wiki/Twenty-eight_%28card_game%29
* http://www.pagat.com/jass/28.html


## Prerequisites

1. You should have nodejs installed. http://nodejs.org/
2. You should have git installed. 

## Developer Notes
1. Download source code from https://github.com/justsans/kalikku
    ```
    git clone https://github.com/justsans/kalikku trump
    cd trump
    ```

2. Once you have a local copy of the source code you can download all the required dependencies using npm. 
All the commands below should be executed from the directory that you downloaded the source code to. 
   ```
   npm install 
   ```
3. Install jasmine-node so that you can run tests.
   ```
   npm install jasmine-node -g
   ```
4. Run your tests. 
   ```
   jasmine-node spec
   ```
5. If the tests are successfull you are ready to start the app and play the game. 
The following should bring up the game in http://localhost:5000
   ```
   node server.js
   ```
