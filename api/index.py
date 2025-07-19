import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'ppt_backend')
sys.path.insert(0, backend_path)

# Set environment variable to indicate Vercel deployment
os.environ['VERCEL'] = '1'

from src.main import app

# This is the entry point for Vercel
app = app

