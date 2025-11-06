import sys
import os
from flask import Flask
from flask_cors import CORS

# Add backend directory to path if running from project root
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['TESTING'] = False

    # Root endpoint
    @app.route('/')
    def index():
        return {
            'message': 'Mega Monopoly Rules API',
            'status': 'running',
            'endpoints': {
                '/': 'API information',
                '/api/hello': 'Test endpoint',
                '/api/hello?name=YourName': 'Test endpoint with parameter'
            }
        }

    # Health check endpoint
    @app.route('/health')
    def health():
        return {'status': 'healthy'}

    # Register blueprints
    from api.routes.hello import hello_bp
    app.register_blueprint(hello_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8000)
