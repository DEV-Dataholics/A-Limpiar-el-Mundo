import os

replacements = {
    'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
    'Ã±': 'ñ', 'Ã‘': 'Ñ',
    'Ã ': 'Á', 'Ã‰': 'É', 'Ã ': 'Í', 'Ã“': 'Ó', 'Ãš': 'Ú',
    'A³': 'ó', 'A±': 'ñ', 'A¡': 'á',
    'mÃ¡s': 'más',
    'Ãºn': 'ún',
    'Ãn': 'ín',
    'Ã³n': 'ón',
    'A³n': 'ón',
    'A¡s': 'ás',
    'A±o': 'ño',
    'A±a': 'ña'
}

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.html')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            modified = False
            for bad, good in replacements.items():
                if bad in content:
                    content = content.replace(bad, good)
                    modified = True
            
            if modified:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print('Fixed', path)
