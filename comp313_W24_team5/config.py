class Config(object):
    SECRET_KEY = 'nowthisissecret'
    MONGO_URI = "mongodb+srv://ebilgeca:BwoSLCHaRyn3iUwm@cluster0.v5ifu66.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    JWT_SECRET_KEY = 'jwtsecretkey'



class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = 'mongodb://localhost:27017/test_database'


class ProductionConfig(Config):
    DEBUG = False