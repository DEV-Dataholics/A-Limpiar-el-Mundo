import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it's double-encoded, trying to encode to latin-1 and decode to utf-8 will recover the original
    # We will only do this if it contains common mojibake sequences.
    mojibake = ['Ã', 'ðŸ', 'â', 'ï¸']
    if not any(m in content for m in mojibake):
        return

    try:
        fixed_content = content.encode('windows-1252').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        # Maybe it's latin-1 instead of windows-1252
        try:
            fixed_content = content.encode('latin-1').decode('utf-8')
        except (UnicodeEncodeError, UnicodeDecodeError):
            return

    # To be safe, let's only replace if it's different and we didn't crash
    if fixed_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print(f"Fixed: {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.html', '.css', '.js')):
            fix_file(os.path.join(root, file))
