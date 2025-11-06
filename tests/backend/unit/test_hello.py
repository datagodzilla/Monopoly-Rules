import pytest

def test_hello_endpoint(client):
    """Test hello endpoint returns greeting"""
    response = client.get('/api/hello')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Hello, World!'

def test_hello_with_name(client):
    """Test hello endpoint with name parameter"""
    response = client.get('/api/hello?name=Developer')
    assert response.status_code == 200
    data = response.get_json()
    assert data['message'] == 'Hello, Developer!'
