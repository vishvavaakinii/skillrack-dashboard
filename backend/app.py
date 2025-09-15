from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup, NavigableString
import time
import re
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def setup_chrome_driver():
    """Setup Chrome driver with optimal settings"""
    options = Options()
    
    # Headless mode
    options.add_argument('--headless')
    
    # Performance optimizations
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-web-security')
    options.add_argument('--disable-extensions')
    options.add_argument('--disable-plugins')
    options.add_argument('--disable-images')
    options.add_argument('--disable-javascript')
    
    # User agent
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    # Window size
    options.add_argument('--window-size=1920,1080')
    
    try:
        driver = webdriver.Chrome(options=options)
        driver.set_page_load_timeout(30)
        return driver
    except Exception as e:
        logger.error(f"Failed to setup Chrome driver: {e}")
        return None

def validate_skillrack_url(url):
    """Validate if the URL is a proper SkillRack profile URL"""
    skillrack_pattern = r'http://www\.skillrack\.com/profile/\d+/[a-f0-9]+'
    return re.match(skillrack_pattern, url) is not None

def extract_skillrack_data(url):
    """Extract data from SkillRack profile"""
    driver = None
    try:
        logger.info(f"Starting data extraction for URL: {url}")
        
        # Validate URL
        if not validate_skillrack_url(url):
            return {"error": "Invalid SkillRack profile URL format"}
        
        # Setup driver
        driver = setup_chrome_driver()
        if not driver:
            return {"error": "Failed to initialize browser"}
        
        # Navigate to URL
        driver.get(url)
        logger.info("Page loaded successfully")
        
        # Wait for page to load
        time.sleep(3)
        
        # Get page source and parse with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Initialize data dictionary
        data = {}
        
        # Extract Name
        name_div = soup.find('div', class_='ui big label black')
        if name_div:
            data['Name'] = name_div.text.strip()
            logger.info(f"Found name: {data['Name']}")
        else:
            logger.warning("Name not found")
            data['Name'] = "Not Found"
        
        # Extract Roll Number, College, Year from siblings
        roll = dept = college = year = None
        if name_div:
            ptr = name_div
            texts_found = []
            
            # Loop through next siblings to capture plain text items
            while ptr and len(texts_found) < 4:
                ptr = ptr.next_sibling
                if isinstance(ptr, NavigableString):
                    text = ptr.strip()
                    if text:
                        texts_found.append(text)
            
            # Map the text values to their fields
            if len(texts_found) >= 3:
                roll = texts_found[0]
                college = texts_found[1]
                year = texts_found[2]
        
        data['Roll Number'] = roll or "Not Found"
        data['College'] = college or "Not Found"
        data['Year'] = year or "Not Found"
        
        # Extract Department
        dept_div = soup.find('div', class_='ui large label')
        data['Department'] = dept_div.text.strip() if dept_div else "Not Found"
        
        # Extract all statistics
        statistics = soup.find_all('div', class_='statistic')
        logger.info(f"Found {len(statistics)} statistics")
        
        for stat in statistics:
            value_div = stat.find('div', class_='value')
            label_div = stat.find('div', class_='label')
            
            if value_div and label_div:
                # Clean the value (take last part if there are multiple values)
                value = value_div.get_text(strip=True).split()[-1]
                label = label_div.get_text(strip=True).upper()
                data[label] = value
                logger.info(f"Extracted {label}: {value}")
        
        # Ensure all required fields exist with default values
        required_fields = {
            'RANK': '0',
            'LEVEL': '0/10',
            'GOLD': '0',
            'SILVER': '0',
            'BRONZE': '0',
            'PROGRAMS SOLVED': '0',
            'CODE TEST': '0',
            'CODE TRACK': '0',
            'DC': '0',
            'DT': '0',
            'CODE TUTOR': '0',
            'C': '0',
            'Python3': '0',
            'Java': '0',
            'CPP23': '0',
            'CPP': '0'
        }
        
        for field, default_value in required_fields.items():
            if field not in data:
                data[field] = default_value
        
        logger.info("Data extraction completed successfully")
        return data
        
    except Exception as e:
        logger.error(f"Error during data extraction: {e}")
        return {"error": f"Failed to extract data: {str(e)}"}
    
    finally:
        if driver:
            driver.quit()
            logger.info("Browser closed")

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "message": "SkillRack Dashboard API is running!",
        "status": "healthy",
        "endpoints": {
            "POST /api/profile": "Extract SkillRack profile data",
            "GET /": "Health check"
        }
    })

@app.route('/api/profile', methods=['POST'])
def get_profile_data():
    """Extract SkillRack profile data from URL"""
    try:
        # Get JSON data from request
        json_data = request.get_json()
        
        if not json_data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        profile_url = json_data.get('url', '').strip()
        
        if not profile_url:
            return jsonify({"error": "Profile URL is required"}), 400
        
        logger.info(f"Received request for URL: {profile_url}")
        
        # Extract data
        profile_data = extract_skillrack_data(profile_url)
        
        # Check if extraction was successful
        if "error" in profile_data:
            return jsonify(profile_data), 400
        
        # Return successful response
        return jsonify({
            "success": True,
            "data": profile_data,
            "message": "Profile data extracted successfully"
        })
        
    except Exception as e:
        logger.error(f"API error: {e}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

@app.route('/api/validate-url', methods=['POST'])
def validate_url():
    """Validate SkillRack profile URL format"""
    try:
        json_data = request.get_json()
        
        if not json_data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        profile_url = json_data.get('url', '').strip()
        
        if not profile_url:
            return jsonify({"error": "Profile URL is required"}), 400
        
        is_valid = validate_skillrack_url(profile_url)
        
        return jsonify({
            "valid": is_valid,
            "message": "Valid SkillRack profile URL" if is_valid else "Invalid URL format"
        })
        
    except Exception as e:
        logger.error(f"URL validation error: {e}")
        return jsonify({
            "error": "Validation failed",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    # Check if Chrome is available
    try:
        driver = setup_chrome_driver()
        if driver:
            driver.quit()
            logger.info("Chrome driver test successful")
        else:
            logger.error("Chrome driver test failed")
    except Exception as e:
        logger.error(f"Chrome driver test error: {e}")
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True
    )