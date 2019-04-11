from qinterest.models import Pin
from ..utils import extract_initial_data


def test_short_real(app_filled_db):
    client = app_filled_db.test_client()

    with app_filled_db.app_context():
        short = Pin.query.get(1).short

    response = client.get(f'/s/{short}')
    assert response.status_code == 302


def test_short_unknown(app_blank_db):
    client = app_blank_db.test_client()
    response = client.get('/s/foobar')
    assert response.status_code == 200

    initial_data = extract_initial_data(response.data.decode())
    assert initial_data is not None
    assert 'error' in initial_data
    assert initial_data['error'] == 404
