<h1 align="center">
    Web-app to create an account and play chess games.
</h1>

## Project overview

Frontend  =  React <br>
Backend   =  Django <br>
Chess AI  =  Pytorch <br>

python3 -m venv env-venv
source env-venv/bin/activate
pip install -r requirements.txt
django-admin startproject backend

python manage.py makemigrations
python manage.py migrate
python manage.py runserver

npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom jwt-decode
