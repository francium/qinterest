import logging
import re
import json
from typing import Optional


_logger = logging.getLogger(__name__)


def extract_initial_data(data: str) -> Optional[dict]:
    m = re.search(r'(?<=(const initialData = )).*', data)
    if not m:
        return None
    try:
        return json.loads(data[m.span()[0] : m.span()[1]])
    except Exception as exc:
        _logger.error(f'Failed to decode json: {exc}')
        return None
