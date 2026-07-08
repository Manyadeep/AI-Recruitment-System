from flask import Blueprint, jsonify

company_bp = Blueprint('company', __name__)

@company_bp.route('/', methods=['GET'])
def get_company():
    return jsonify({
        'name': 'TechVision Solutions',
        'industry': 'Information Technology',
        'founded': '2018',
        'website': 'www.techvisionsolutions.com',
        'headquarters': 'Bengaluru, India',
        'size': '200–500 employees',
        'mission': 'To build world-class software products that empower businesses through intelligent technology solutions.',
        'vision': 'To be the most trusted technology partner for enterprises across South Asia and beyond.',
        'about': (
            'TechVision Solutions is a fast-growing technology company specializing in enterprise software, '
            'AI-driven automation, and data analytics platforms. We work with Fortune 500 clients and '
            'emerging startups alike, delivering cutting-edge solutions in cloud computing, machine learning, '
            'and digital transformation.'
        ),
        'departments': [
            {'name': 'Engineering', 'head_count': 85},
            {'name': 'Data & Analytics', 'head_count': 40},
            {'name': 'Product Management', 'head_count': 25},
            {'name': 'Sales & Marketing', 'head_count': 35},
            {'name': 'Human Resources', 'head_count': 15},
        ],
        'open_roles': 3,
        'total_applicants': 30,
    })
