import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient

app = Flask(__name__, instance_relative_config=True)
app.config["JSON_SORT_KEYS"] = False

load_dotenv()
mongo = MongoClient(os.environ.get("DATABASE_URL"))
db = mongo.frostbite

CORS(app)

from app import teams, player, lines, utilities
