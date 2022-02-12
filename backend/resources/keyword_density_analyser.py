import re
import content
import pickle

text = content.text.lower()
text = re.sub(r'[\d]+', '', text)
clean_text = re.sub(r'[,:;/+–\-|().]', ' ', text)
clean_text = re.sub(r'\s+', ' ', clean_text)
total_count = len(clean_text.split())
keywords = [set(clean_text.split()), set(), set()]
final = [[], [], []]

parts = re.split(r'[,:;/+–\-|().]', text)
for i in range(2, 4):
    for part in parts:
        temp = part.split()
        length = len(temp)
        for j in range(0, length - i + 1):
            phrase = ' '.join(temp[j: j + i])
            keywords[i - 1].add(phrase)

for i in range(3):
    for word in keywords[i]:
        count = len(re.findall(fr'\b{word}\b', clean_text))
        if len(word) > 2 and count > 1:
            density = f'{round(count * (i+1) * 100 / total_count, 2)}%'
            final[i].append((word, count, density))
    final[i] = sorted(final[i], key=lambda a: a[1], reverse=True)

for idk in final:
    print(idk)
    
a,b,c=final