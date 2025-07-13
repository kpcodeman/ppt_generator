# PPT Generator - AI-Powered Presentation Tool

A modern, lightweight web application that generates PowerPoint presentations using AI/LLM integration. Users can create presentations from natural language descriptions, upload images for inspiration, or enhance existing PowerPoint files.

## Features

### Core Functionality
- **Natural Language Input**: Describe your presentation in plain English
- **Image Upload**: Upload images for AI-powered presentation generation
- **PPT Upload**: Upload existing PowerPoint files for enhancement and refinement
- **LLM Integration**: Configure your own LLM endpoint (OpenAI, custom APIs, etc.)
- **Real-time Refinement**: Iteratively improve presentations with additional prompts
- **Modern UI**: Responsive, mobile-friendly interface built with React and Tailwind CSS

### Technical Features
- **Lightweight Frontend**: React-based SPA with modern UI components
- **Robust Backend**: Flask API with comprehensive error handling
- **File Management**: Secure file upload and session management
- **Cross-Origin Support**: CORS-enabled for seamless frontend-backend communication
- **Thumbnail Generation**: Visual preview of generated slides
- **Download Support**: Direct PowerPoint file downloads

## Architecture

### Frontend (React)
- **Framework**: React with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React icons
- **State Management**: React hooks
- **File Handling**: Native HTML5 file upload with drag-and-drop UI

### Backend (Flask)
- **Framework**: Flask with CORS support
- **PPT Generation**: python-pptx library
- **LLM Integration**: OpenAI SDK with custom endpoint support
- **File Processing**: PIL for image handling
- **Session Management**: In-memory session storage with UUID

### API Endpoints
- `POST /api/ppt/generate` - Generate PPT from text input
- `POST /api/ppt/refine` - Refine existing PPT with additional prompts
- `POST /api/ppt/upload` - Upload files (images/PPT)
- `POST /api/ppt/analyze-upload` - Analyze uploaded files and generate PPT
- `GET /api/ppt/download/<session_id>` - Download generated PPT
- `GET /api/ppt/thumbnail/<session_id>/<slide_number>` - Get slide thumbnails

## Installation & Setup

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+ with pip
- Git

### Backend Setup
```bash
cd backend/ppt_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend/ppt_frontend
pnpm install
```

### Running Locally

#### Start Backend
```bash
cd backend/ppt_backend
source venv/bin/activate
python src/main.py
```
Backend will run on `http://localhost:5000`

#### Start Frontend
```bash
cd frontend/ppt_frontend
pnpm run dev --host
```
Frontend will run on `http://localhost:5173`

## Usage

### Basic Workflow
1. **Choose Input Method**: Select from text input, image upload, or PPT upload
2. **Configure LLM**: Enter your API key, endpoint, and model
3. **Generate**: Click "Generate Presentation" or "Analyze Upload"
4. **Review**: View generated slides and theme colors
5. **Refine**: Use refinement prompts to improve the presentation
6. **Download**: Download the final PowerPoint file

### LLM Configuration
- **API Key**: Your LLM provider's API key
- **Endpoint**: API endpoint URL (default: OpenAI)
- **Model**: Model name (e.g., gpt-3.5-turbo, gpt-4)

### Supported File Types
- **Images**: JPG, JPEG, PNG, GIF (up to 16MB)
- **Presentations**: PPT, PPTX (up to 16MB)

## Deployment

### Vercel Deployment

#### Frontend Deployment
```bash
cd frontend/ppt_frontend
pnpm run build
# Deploy the dist/ folder to Vercel
```

#### Backend Deployment
The Flask backend can be deployed to various platforms:
- **Vercel**: Use serverless functions
- **Heroku**: Standard Python deployment
- **Railway**: Container deployment
- **DigitalOcean**: VPS deployment

### Environment Variables
```bash
# Backend
FLASK_ENV=production
SECRET_KEY=your-secret-key

# Frontend
VITE_API_BASE_URL=https://your-backend-url.com
```

### Build Commands
```bash
# Frontend build
cd frontend/ppt_frontend
pnpm run build

# Backend dependencies
cd backend/ppt_backend
pip freeze > requirements.txt
```

## Configuration

### Frontend Configuration
Update `src/App.jsx` to change the API base URL:
```javascript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' 
  : 'http://localhost:5001'
```

### Backend Configuration
Update `src/main.py` for production settings:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=False)
```

## API Documentation

### Generate PPT Endpoint
```http
POST /api/ppt/generate
Content-Type: application/json

{
  "input": "Create a presentation about AI",
  "api_key": "your-api-key",
  "endpoint": "https://api.openai.com/v1/chat/completions",
  "model": "gpt-3.5-turbo",
  "session_id": "optional-session-id"
}
```

### Response Format
```json
{
  "session_id": "uuid-string",
  "structure": {
    "title": "Presentation Title",
    "theme": {
      "primary_color": "#2E86AB",
      "secondary_color": "#A23B72",
      "background_color": "#F18F01",
      "text_color": "#C73E1D"
    },
    "slides": [
      {
        "title": "Slide Title",
        "content": "Slide content",
        "bullet_points": ["Point 1", "Point 2"],
        "image_suggestion": "Image description"
      }
    ]
  },
  "thumbnails": [
    {
      "slide_number": 1,
      "thumbnail_url": "/api/ppt/thumbnail/session-id/1"
    }
  ],
  "download_url": "/api/ppt/download/session-id"
}
```

## Troubleshooting

### Common Issues

#### CORS Errors
Ensure the backend has CORS enabled:
```python
from flask_cors import CORS
CORS(app, origins="*")
```

#### File Upload Issues
Check file size limits and supported formats:
```python
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
```

#### LLM API Errors
- Verify API key is correct
- Check endpoint URL format
- Ensure model name is supported
- Monitor rate limits

#### Port Conflicts
Change ports if needed:
```bash
# Backend
python src/main.py --port 5001

# Frontend
pnpm run dev --port 3000
```

## Development

### Project Structure
```
ppt_gen_tool/
├── frontend/ppt_frontend/
│   ├── src/
│   │   ├── components/ui/     # shadcn/ui components
│   │   ├── App.jsx           # Main application
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/ppt_backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── ppt.py        # PPT generation routes
│   │   │   └── user.py       # User management routes
│   │   ├── models/           # Database models
│   │   └── main.py           # Flask application
│   ├── requirements.txt
│   └── venv/
└── README.md
```

### Adding New Features

#### New API Endpoints
1. Add route to `src/routes/ppt.py`
2. Update CORS configuration if needed
3. Test with frontend integration

#### Frontend Components
1. Create component in `src/components/`
2. Import and use in `App.jsx`
3. Style with Tailwind CSS

### Testing
```bash
# Backend tests
cd backend/ppt_backend
python -m pytest

# Frontend tests
cd frontend/ppt_frontend
pnpm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Create an issue on GitHub

## Changelog

### v1.0.0
- Initial release
- Basic PPT generation from text
- Image and PPT upload support
- LLM integration with custom endpoints
- Refinement capabilities
- Modern React frontend
- Flask backend with CORS support

