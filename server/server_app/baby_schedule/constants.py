from datetime import time

PARTS_OF_DAY = [
    {"range": (time(5, 0), time(11, 59)), "name": "morning"},
    {"range": (time(12, 0), time(16, 59)), "name": "afternoon"},
    {"range": (time(17, 0), time(20, 59)), "name": "evening"},
    {"range": (time(21, 0), time(4, 59)), "name": "night"},
]
