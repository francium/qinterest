from qinterest import create_app


def test_create_app():
    assert not create_app().testing
    assert create_app({'TESTING': True}).testing
