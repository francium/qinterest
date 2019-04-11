  gunicorn -w 4 -b $APP_IP:$APP_PORT wsgi:app; \
