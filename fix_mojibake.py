import os

replacements = {
    'MÃ NIMO': 'MÍNIMO',
    'â”€': '─',
    'â• ': '═',
    'ðŸšª': '🚪',
    'ðŸ“…': '📅',
    'ðŸ“ ': '📌',
    'â ±ï¸ ': '⏳',
    'â ³': '⌛',
    'â ¤ï¸ ': '❤️',
    'â€¢': '•',
    'â† ': '←',
    'â†’': '→',
    'â†—': '↗',
    'â˜°': '☰',
    'âš¡': '⚡',
    'âœ…': '✅',
    'â Œ': '❌',
    'ðŸ› ï¸ ': '🛠️',
    'ðŸŒ¿': '🌿',
    'ðŸ“š': '📚',
    'ðŸ ¾': '🐾',
    'ðŸ“„': '📄',
    'ðŸ“Š': '📊',
    'ðŸ“‚': '📂',
    'ðŸ¤ ': '🤝',
    'ðŸ‘¥': '👥',
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã‘': 'Ñ',
    'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú',
    'Â¡': '¡'
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False
    for bad, good in replacements.items():
        if bad in content:
            content = content.replace(bad, good)
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.html', '.css', '.js')):
            fix_file(os.path.join(root, file))
