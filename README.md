<h1 align="center">
    Web-app to create an account and play chess games.
</h1>

## Project overview

Frontend  =  React <br>
Backend   =  Django <br>
Chess AI  =  Pytorch <br>

python3 -m venv env-venv<br>
source env-venv/bin/activate<br>
pip install -r requirements.txt<br>
django-admin startproject backend<br>

python manage.py makemigrations<br>
python manage.py migrate<br>
python manage.py runserver<br>

npm create vite@latest frontend -- --template react<br>
cd frontend<br>
npm install axios react-router-dom jwt-decode<br>
