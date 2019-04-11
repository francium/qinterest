from os import environ
import json
from typing import Optional

from pymemcache.client import base

from .consts import INITIAL_PIN_COUNT
from .models import Pin, User

MEMCACHE_IP: Optional[str] = environ.get('MEMCACHE_IP')
MEMCACHE_PORT: Optional[str] = environ.get('MEMCACHE_PORT')
MEMCACHE_EXPIRE = 300

_M_PIN = 'pin'
_M_INSERTED_PIN_KEYS = 'inserted_pins'

memcache = base.Client((MEMCACHE_IP, int(MEMCACHE_PORT or -1))) if MEMCACHE_IP else None

def query_front_page_data():
    return query_pins(limit=INITIAL_PIN_COUNT)


def query_pins(*, username=None, offset=0, limit=10):
    # Pins by a user
    if username is not None:
        return [
            p.dump() for p in Pin.query\
                                  .filter_by(username=username)\
                                  .order_by(Pin.id.desc())\
                                  .offset(offset)\
                                  .limit(limit)
        ]

    # Pins by all users
    else:
        key = f'{_M_PIN}-{offset}-{limit}'

        results = memcache.get(key) if memcache else None
        if results:
            return json.loads(results.decode('utf-8'))

        results = [
            p.dump() for p in Pin.query\
                                  .order_by(Pin.id.desc())\
                                  .offset(offset)\
                                  .limit(limit)
        ]

        if memcache:
            memcache.set(key, json.dumps(results), MEMCACHE_EXPIRE)
        m_update_inserted_pins(key)

        return results


def m_update_inserted_pins(new_key):
    keys_result = memcache.get(_M_INSERTED_PIN_KEYS) if memcache else None
    keys = json.loads(keys_result.decode('utf-8')) if keys_result else []

    if memcache and new_key not in keys:
        keys.append(new_key)
        memcache.set(_M_INSERTED_PIN_KEYS, json.dumps(keys))


def m_refresh_pin_cache():
    keys_result = memcache.get(_M_INSERTED_PIN_KEYS) if memcache else None
    if keys_result:
        keys = json.loads(keys_result.decode('utf-8'))
        for key in keys:
            memcache.delete(key)

    if memcache:
        memcache.set(_M_INSERTED_PIN_KEYS, json.dumps([]))
        _ = query_front_page_data()
