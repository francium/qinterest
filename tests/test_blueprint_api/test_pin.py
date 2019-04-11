def test_pin_get_by_username(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/pin?username=user1&offset=0&limit=10')
    assert response.status_code == 200

    assert response.json is not None
    assert len(response.json) == 2


def test_pin_get_offset(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/pin?username=user1&offset=1')
    assert response.status_code == 200

    assert response.json is not None
    assert len(response.json) == 1


def test_pin_get_limit(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/pin?username=user1&limit=1')
    assert response.status_code == 200

    assert response.json is not None
    assert len(response.json) == 1


def test_pin_get_unknown_user(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/pin?username=randomuser')
    assert response.status_code == 200

    assert response.json is not None
    assert len(response.json) == 0


def test_pin_get_no_username(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/pin?limit=10&offset=0')
    assert response.status_code == 200

    assert response.json is not None
    assert len(response.json) == 2


def test_pin_get_no_arguments(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('api/pin')
    assert response.status_code == 200

    assert response.json is not None
    assert len(response.json) == 2


def test_pin_post_unauthorized(app_blank_db):
    client = app_blank_db.test_client()

    payload = {'url': 'test-url'}
    response = client.post('api/pin', json=payload)
    assert response.status_code == 401


# TODO: Implement login mocking
# get 200 when try to post a new pin while logged in


def test_pin_delete_unauthorized(app_blank_db):
    client = app_blank_db.test_client()
    response = client.delete('api/pin?id=1')
    assert response.status_code == 401


# TODO: Implement login mocking
# get 200 when try to delete current user's (own) pin
# get 404 when try to delete unknown pin
# get 401 when try to delete another user's pin
