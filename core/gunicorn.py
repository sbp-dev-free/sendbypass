import multiprocessing
import os
import environ
import MySQLdb

ENV = environ.Env()
environ.Env.read_env('core/.env')

env_work_connections = ENV.int('GUNICORN_WORK_CONNECTIONS', 1)
env_workers = ENV.int('GUNICORN_WORKERS', 0)
expose_port = ENV.int('GUNICORN_PORT', 8000)
run_in_nginx = ENV.int('RUN_NGINX', 0) == 1

name = "core"
bind = "0.0.0.0:{}".format(str(expose_port)) if not run_in_nginx else "unix:/opt/core/core.sock"
workers = env_workers if env_workers else multiprocessing.cpu_count()
keepalive = 32
worker_connections = env_work_connections
worker_class = "gevent"
reload = ENV.bool('GUNICORN_RELOAD_WORKERS', False)
loglevel = 'INFO'
logfile = '-'
timeout = 180

BASE_DIR = os.getcwd()
pythonpath = BASE_DIR
chdir = BASE_DIR
