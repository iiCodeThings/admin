import argparse
from doom.app import create_app


app = create_app()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='127.0.0.1', help='server host ip')
    parser.add_argument('--port', default=5000, help='server bindbing port')
    args = parser.parse_args()
    app.run(host=args.host, port=args.port)
