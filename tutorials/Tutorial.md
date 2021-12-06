# Welcome to the team!

This tutorial will guide you through the complete installation of the project on your local machine. To start with, make sure you have already installed nodeJS and reactJS on your computer. Also, make sure to install python 3.7.4, specifically. We had some epic failures when the setup was tested on Python 3.9.9 and 3.10.0. So try not to install these versions. Make sure to not test any versions lower than Python 3.5.

# Backend API server setup

Open a terminal at your desired location and start with cloning the development branch of this repository. Downloading the zip file or not specifying the -b flag will clone the main branch, which we strictly do not recommend.

    git clone -b development https://github.com/skionetizy/skionetizy__MVP.git
Navigate to set the path at the root folder of the cloned repo, ie the skionetizy__MVP directory. Create a new virtual environment with

    python -m venv venv
Try not to change the name of this virtual environment as .venv is included in the gitignore, so it would be easier to switch between branches when required.

Activate the newly created environment. On a Windows machine, one would do

    `.\venv\Scripts\activate
This will install a lower version of pip, with which the next steps wouldn’t work. Update pip first

    python -m pip install -U pip

Install all the required python modules

    python -m pip install -r requirements.txt
  
  After all the installation the next step is to make sure that APP_SETTINGS & other environment variables are set. on Windows machine

    set APP_SETTINGS=DevelopmentConfig

Rest settings are automatically set using a .env file. Just make sure that you have the **.env** file at the root folder of the cloned repository.

# Frontend react server setup

To run the project you will need both backend API server as well as the react server running.
start the backend server with

    python app.py
Your API server should start now at  http://localhost:5000. Navigate to Frontend\skionetizy directory and run

    npm install
After that run

    npm start

and your react server should open up on http://localhost:3000

If needed, you can simply login by adding this to your local storage profileID as key, and “96f59486-18b4-4f03-8923-9e4571e8e6b5” as value, including “” only on the value.

