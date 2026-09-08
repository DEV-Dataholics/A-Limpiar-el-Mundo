import os

# Create a custom encoding that maps 0-255 to 0-255 directly for Latin-1,
# but uses the windows-1252 characters for the visible ones.
def fix_string(s):
    # Convert string back to bytes
    raw_bytes = bytearray()
    for char in s:
        code = ord(char)
        if code < 256:
            # Assume it's latin-1 mapped
            raw_bytes.append(code)
        else:
            # It's a windows-1252 character, let's try to encode it
            try:
                b = char.encode('windows-1252')
                raw_bytes.extend(b)
            except UnicodeEncodeError:
                # If we really can't encode it, just put a question mark
                raw_bytes.append(63)
    
    # Now decode as UTF-8
    try:
        return raw_bytes.decode('utf-8')
    except UnicodeDecodeError:
        return s

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    mojibake = ['Ã', 'ðŸ', 'â', 'ï¸']
    if not any(m in content for m in mojibake):
        return

    fixed_content = fix_string(content)
    
    if fixed_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed: {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.html', '.css', '.js')):
            fix_file(os.path.join(root, file))
