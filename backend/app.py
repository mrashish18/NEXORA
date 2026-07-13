from flask import Flask
from flask_cors import CORS

from routes.upload import upload_bp
from routes.rag import rag_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(upload_bp)

app.register_blueprint(rag_bp)


@app.route("/")
def home():
    return {
        "project": "NEXORA AI",
        "version": "1.0",
        "status": "running"
    }


if __name__ == "__main__":
    app.run(debug=True)