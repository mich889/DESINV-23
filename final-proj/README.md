
# DESINV 23 Final Project: Facial Tattoo Perception 
By Michelle Chen
May 2025


This project is a tool designed to study public perception of facial tattoos through interactive 3D model comparison. By presenting participants with identical 3D face models - one with and one without facial tattoos - we collect data on how tattoos affect people's perceptions and judgments.

## Project Purpose

The goal of this study is to:
- Create realistic 3D creations of individuals with tattoos
- Understand how facial tattoos influence first impressions


## Project Structure

- `app.py`: Main Flask application handling the web interface and participant responses
- `display.py`: 3D face model visualization using Open3D and Gradio
- `votes.txt`: Database of participant responses and reactions
- `static/`: Directory containing 3D face models (with and without tattoos)

## Usage

### Web Interface

1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to `http://localhost:5001`

### 3D Model Visualization

1. Run the visualization interface:
```bash
python display.py
```

2. Use the interface to compare the tattooed and non-tattooed versions of the 3D face models

## Data Visualization

The system collects anonymous participant responses in `votes.txt` with the following format:
- Timestamp
- X coordinate (-1 to 1): Represents position on a perception scale (negative to positive) --> red intesity
- Y coordinate (-1 to 1): Represents intensity of reaction (bold to scary) --> blue intensity

This is then visualized with a color scale accordingly

