from flask import Blueprint, request, jsonify

hello_bp = Blueprint('hello', __name__)

@hello_bp.route('/hello', methods=['GET'])
def hello():
    name = request.args.get('name', 'World')
    return jsonify({'message': f'Hello, {name}!'})
