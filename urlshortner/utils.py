import uuid 

def generate_short_code():
    return str(uuid.uuid4()).replace("-","")[:8]