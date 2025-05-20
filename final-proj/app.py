from flask import Flask, render_template, jsonify, request, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

# File to store votes
VOTES_FILE = 'votes.txt'

def get_all_votes():
    votes = []
    if os.path.exists(VOTES_FILE):
        with open(VOTES_FILE, 'r') as f:
            # Skip header
            next(f)
            for line in f:
                try:
                    timestamp, x, y = line.strip().split(',')
                    votes.append({
                        'x': float(x),
                        'y': float(y)
                    })
                except:
                    continue
    return votes

def save_vote(x, y):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(VOTES_FILE, 'a') as f:
        f.write(f"{timestamp},{x:.3f},{y:.3f}\n")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vote', methods=['POST'])
def vote():
    data = request.get_json()
    x = float(data.get('x', 0))
    y = float(data.get('y', 0))
    
    # Ensure coordinates are within -1 to 1 range
    x = max(-1, min(1, x))
    y = max(-1, min(1, y))
    
    save_vote(x, y)
    return jsonify({'status': 'success'})

@app.route('/get_votes')
def get_votes():
    votes = get_all_votes()
    return jsonify(votes)

@app.route('/<path:filename>')
def serve_ply(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    # Create votes file if it doesn't exist
    if not os.path.exists(VOTES_FILE):
        with open(VOTES_FILE, 'w') as f:
            f.write("timestamp,x,y\n")
    # Use environment variable for port if available (for production)
    port = int(os.environ.get('PORT', 5001
                            ))
    app.run(host='0.0.0.0', port=port) 