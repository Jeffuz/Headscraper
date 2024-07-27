import requests

# Firebase Realtime Database URL
database_url = 'https://headscrapers-b079a.firebaseio.com/assignments.json'
# Your Firebase ID token
id_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYjQyNzQyYWU1OGY0ZGE0NjdiY2RhZWE0Yjk1YTI5ZmJhMGM1ZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaGVhZHNjcmFwZXJzLWIwNzlhIiwiYXVkIjoiaGVhZHNjcmFwZXJzLWIwNzlhIiwiYXV0aF90aW1lIjoxNzIyMDczMTEwLCJ1c2VyX2lkIjoiQ1VWR2oydUROTmJ0Tm8xdHFPRkFxMUM1YWRRMiIsInN1YiI6IkNVVkdqMnVETk5idE5vMXRxT0ZBcTFDNWFkUTIiLCJpYXQiOjE3MjIwNzMxMTAsImV4cCI6MTcyMjA3NjcxMCwiZW1haWwiOiJ0ZXN0MkBleGFtcGxlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0MkBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.hL8LIkbFott0JQzaNLvAmA0aqn98Pe7D7WW7aqSufvEWCEYU1Jv4PEFHELvGCFVncuw_fHdE1HRHKCAXx3C9kbKEyFmKiO36ChKXU7qUxtMHUzeqj45bfxx9k3ArkmLb-9_jPWk2RFzdGaHtpqzP5HuG4Y37ftWda8B8_AYvFaZ-5drF77dwpmawm1VZe74VFBNvMKbDyJ7Avdrj7bLNVqj9VadDknOoyJew5T6YbKfcpdruOaEq3ZrPyMaSvMfDt8EXtaVm3-De4jsFKhiuwZDAWZPzSPVQydH1qdTlVDIWaJbkDvSQk2Jvo_NqZyPTwHRGreqGM1uW9bSxmWOYKQ'

# Headers for the request
headers = {
    'Authorization': f'Bearer {id_token}',
    # 'Content-Type': 'application/json'
}

# Data to be sent
data = {
    "title": "Assignment Title",
    "type": "Homework",
    "due_date": "2024-08-01",
    "open_date": "2024-07-01",
    "status": "to do"
}

# Create/Update data
response = requests.post(database_url, json=data, headers=headers)
print(response.json())
