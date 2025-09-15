# SkillRack Dashboard - Backend

Python Flask API backend for the SkillRack Dashboard project.

## 🚀 Overview

The backend is built with Python Flask and provides RESTful API endpoints for skill tracking, user management, and data analytics for the SkillRack Dashboard frontend.

## 🛠️ Tech Stack

- **Python 3.x** - Core programming language
- **Flask** - Lightweight WSGI web application framework
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **SQLAlchemy** - SQL toolkit and Object-Relational Mapping
- **SQLite/PostgreSQL** - Database management system

## 📁 Project Structure

```
backend/
├── app.py                   # Main Flask application
├── requirements.txt         # Python dependencies
├── venv/                   # Virtual environment (excluded from git)
├── models/                 # Database models (if applicable)
├── routes/                 # API route definitions (if applicable)
├── utils/                  # Utility functions (if applicable)
└── README.md               # This file
```

## 🔧 Prerequisites

- **Python 3.7 or higher**
- **pip** (Python package manager)
- **virtualenv** (recommended for virtual environment)

## 🚀 Installation & Setup

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Create a virtual environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
# Install required packages
pip install -r requirements.txt
```

### 4. Run the application
```bash
# Start the Flask development server
python app.py
```

The backend API will be available at `http://localhost:5000` (or configured port)

## 📦 Dependencies

Based on `requirements.txt`, this project includes:

```txt
flask
flask-cors
requests
python-dotenv
# ... other dependencies as specified
```

### Installing Dependencies
```bash
# Install all dependencies
pip install -r requirements.txt

# Install specific dependency
pip install flask

# Update requirements.txt after installing new packages
pip freeze > requirements.txt
```

## 🌐 API Endpoints

The Flask application provides RESTful API endpoints for:

### Authentication (if implemented)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Skills Management
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/<id>` - Update skill
- `DELETE /api/skills/<id>` - Delete skill

### User Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update progress
- `GET /api/analytics` - Get analytics data

### Example API Usage
```python
# Example Flask route
@app.route('/api/skills', methods=['GET'])
def get_skills():
    try:
        # Logic to fetch skills
        skills = fetch_all_skills()
        return jsonify({
            'success': True,
            'data': skills
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

## 🔄 Development Workflow

### 1. Activate Virtual Environment
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Make Changes
- Edit `app.py` or create new modules
- Add new API endpoints
- Update database models

### 3. Test Your Changes
```bash
# Run the application
python app.py

# Test API endpoints using curl, Postman, or frontend
curl http://localhost:5000/api/skills
```

### 4. Update Dependencies
```bash
# After installing new packages
pip freeze > requirements.txt
```

## 🗄️ Database Configuration

### SQLite (Default - for development)
```python
# app.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skillrack.db'
```

### PostgreSQL (Production)
```python
# app.py
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/skillrack_db'
```

### Database Operations
```bash
# Initialize database (if using Flask-Migrate)
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Or in Python
python
>>> from app import db
>>> db.create_all()
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# .env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///skillrack.db
CORS_ORIGINS=http://localhost:3000
```

Load environment variables:
```python
# app.py
from dotenv import load_dotenv
import os

load_dotenv()

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
```

## 🧪 Testing

### Manual Testing
```bash
# Test API endpoints
curl -X GET http://localhost:5000/api/skills
curl -X POST http://localhost:5000/api/skills -H "Content-Type: application/json" -d '{"name": "Python", "level": "Intermediate"}'
```

### Unit Testing (if implemented)
```bash
# Run tests
python -m pytest tests/
# or
python -m unittest discover tests/
```

## 🚀 Deployment

### Development
```bash
# Run with debug mode
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py
```

### Production
```bash
# Using Gunicorn (install: pip install gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Using uWSGI (install: pip install uwsgi)
uwsgi --http :5000 --wsgi-file app.py --callable app
```

### Cloud Deployment
- **Heroku**: Use `Procfile` and `requirements.txt`
- **AWS Elastic Beanstalk**: Deploy Flask application
- **Google Cloud Platform**: Use App Engine
- **DigitalOcean**: Deploy on droplets

## 📊 Monitoring & Logging

### Logging Configuration
```python
# app.py
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/skillrack.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
```

## 🔧 Configuration

### Flask Configuration
```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///skillrack.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process using port 5000
   sudo kill -9 $(sudo lsof -t -i:5000)
   # Or use different port
   app.run(port=5001)
   ```

2. **Virtual environment issues**:
   ```bash
   # Recreate virtual environment
   rm -rf venv
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. **Database connection issues**:
   ```bash
   # Reset database
   rm -f skillrack.db
   python
   >>> from app import db
   >>> db.create_all()
   ```

4. **CORS errors**:
   ```python
   # Ensure Flask-CORS is properly configured
   from flask_cors import CORS
   CORS(app, origins=['http://localhost:3000'])
   ```

## 📚 API Documentation

### Response Format
All API responses follow this structure:
```json
{
  "success": true/false,
  "data": {...}, // on success
  "error": "error message", // on failure
  "message": "descriptive message"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🔐 Security Best Practices

1. **Use environment variables** for sensitive data
2. **Validate and sanitize** all user inputs
3. **Implement authentication** and authorization
4. **Use HTTPS** in production
5. **Keep dependencies updated**
6. **Implement rate limiting**

## 🤝 Contributing

1. Follow PEP 8 Python style guidelines
2. Write docstrings for functions and classes
3. Add error handling for all API endpoints
4. Write unit tests for new features
5. Update this README when adding new endpoints

## 📝 Example Usage

### Starting the Server
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Making API Calls
```javascript
// Frontend API call example
fetch('http://localhost:5000/api/skills')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

**Happy Coding! 🚀**