# Northcoders News API

This project is an API built to replicate the functionality of a Reddit-like service, providing data for a frontend application. It allows users to fetch articles, comments, topics, and users, as well as perform various operations such as posting comments, voting on articles, and more.

Link to the hosted version: https://be-nc-news-backend-project-hauf.onrender.com/api/

Minimum requirements: Node.js: v22.7.0 and PostgreSQL: v14.13

Firstly, clone the repository to your local machine: https://github.com/Antonio-Bogalho/be-nc-news-backend-project.git
Then cd be-nc-news

Once inside the folder, install all the dependencies using the command: npm install
This will ensure that all dependencies listed in the package.json file are ready to be used.

You will then need to create two ".env" files in the root of the project, one for the test and the other for the development database.

They should look like this: "PGDATABASE=database_name_here"
Make sure to replace database_name_here with the actual names of your test and development databases.

To seed the local PostgreSQL with either of the datas, run the following command: npm run seed

You can run this project's tests by using the command: npm test

You can run the environment locally and test it by running the command: npm start
This will initiate the listen.js file. You can then access the API at http://localhost:5858/api

Any queries or feedback don't hesitate to raise it in the Github repository!

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
