from ..utils import extract_initial_data


def test_user_unknown_user(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('/user/randomuser')
    assert response.status_code == 200

    initial_data = extract_initial_data(response.data.decode())
    assert initial_data is not None

    assert 'error' in initial_data
    assert initial_data['error'] == 404

    assert 'pageUser' not in initial_data


def test_user_real_user(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('/user/user1')
    assert response.status_code == 200

    initial_data = extract_initial_data(response.data.decode())
    assert initial_data is not None

    assert 'error' not in initial_data

    assert 'pageUser' in initial_data
    assert initial_data['pageUser'] is not None
    assert initial_data['pageUser']['name'] == 'user1'
