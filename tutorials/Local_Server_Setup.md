# Setting Up API on Local Server

## Setting Up The Local Environment

1. Make sure you are using *Python version > 3.5*  
2. Git clone the repository
3. Open Terminal and set path at the root folder of the cloned directory
4. With python installed creat a new python virtual environment
5. to create a new venv , run `py -m venv venv`
6. Activate the newly created environment by `.\venv\Scripts\activate` 
7. and run command `pip install -r requirements.txt`
8. This will install all the necessary packages into your environment
9. The next step will be to configure the environment variables
   1. In the terminal enter `set APP_SETTINGS=DevelopmentConfig`
10. Finally to run the API use command `python app.py`

