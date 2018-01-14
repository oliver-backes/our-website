import csv

with open ('fake.csv') as f:
	reader = csv.DictReader (f)
	fake = list(reader)

import json
with open('fake.json', 'w') as f:
	json.dump(fake, f)