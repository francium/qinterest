def test_user_unknown_user(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/user/randomuser')
    assert response.status_code == 404

    assert response.json is not None
    assert 'error' in response.json
    assert response.json['error'] == 404


def test_user_real_user(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/user/user1')
    assert response.status_code == 200

    assert response.json is not None
    assert 'error' not in response.json
    assert 'name' in response.json
    assert 'avatar' in response.json
    assert response.json['name'] == 'user1'
