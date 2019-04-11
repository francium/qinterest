from ..utils import extract_initial_data


def test_index_no_login_no_data(app_blank_db):
    client = app_blank_db.test_client()
    response = client.get('/')
    assert response.status_code == 200

    initial_data = extract_initial_data(response.data.decode())
    assert initial_data is not None

    assert 'pins' in initial_data
    assert len(initial_data['pins']) == 0

    assert 'user' in initial_data
    assert initial_data['user'] is None

    assert b'const initialData = {' in response.data
    assert b'"user": null' in response.data
    assert b'"pins": []' in response.data


def test_index_no_login_with_data(app_filled_db):
    client = app_filled_db.test_client()
    response = client.get('/')
    assert response.status_code == 200

    initial_data = extract_initial_data(response.data.decode())
    assert initial_data is not None

    assert 'pins' in initial_data
    assert len(initial_data['pins']) == 2

    assert 'user' in initial_data
    assert initial_data['user'] is None
