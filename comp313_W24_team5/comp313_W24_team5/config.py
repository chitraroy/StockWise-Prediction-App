class Config(object):
    SECRET_KEY = 'nowthisissecret'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///stock_predictions.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'jwtsecretkey'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_database.db'

class ProductionConfig(Config):
    DEBUG = False