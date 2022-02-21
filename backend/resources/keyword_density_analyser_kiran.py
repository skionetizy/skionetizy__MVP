from flask import Flask,render_template,request, jsonify
import pickle
import re, pprint
from collections import Counter
import string 
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize



app = Flask(__name__)
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calc',methods=["POST","GET"])
def calc():

    f = []
    words = []
    unique_nosw = []
    l = []
    #txt = [x for x in request.form.values()]
    #txt = ' '.join(txt)
    if request.method == "POST":
        req_Json = request.json
        txt = req_Json['txt']
        #t = request.args.get("txt")
        #print(t)
        #txt = request.form.get("txt")
        txt = txt.lower()
        txt = txt.replace('\n','')
        txt = txt.replace('.','')
        txt = txt.replace(',','')
        txt = txt.replace('?','')
        stop_words = set(stopwords.words('english'))
        stop_words = list(stop_words)

        l = txt.split(' ')
        ls = txt.split(' ')
        #print("Number of words including stop words: " + str(len(l)))

        unique_sw = []

        for i in l:
            if i not in unique_sw:
                unique_sw.append(i)

        #print("Number of unique words including stop words:" + str(len(unique_sw)))

        #words = []

        for i in ls:
            if i not in stop_words:
                words.append(i)

        #print("Number of words without stop words: " + str(len(words)))

        #unique_nosw = []

        for i in words:
            if i not in unique_nosw:
                unique_nosw.append(i)

        #print("Number of unique words without stop words:" + str(len(unique_nosw)))

        str1 = " "
        str1 = str1.join(words)

        l1 = N_grams(str1,1)
        word_count1 = {}

        for word in l1:
            if word in word_count1:
                word_count1[word] += 1
            else:
                word_count1[word] = 1
        
        c = Counter(word_count1)
    # returns the most occurring elements
        t = c.most_common(1000)
        #print(type(c))
        d1_l = []
        for i in range(len(t)):
            d1_d = {}
            density = (t[i][1]/len(l))*100
            d1_d['keyword'] = t[i][0]
            d1_d['density'] = density
            d1_d['count'] = t[i][1]
            d1_l.append(d1_d)
            #d1[t[i][0]] = density
        d1_f = {"One word" : d1_l}
        #pprint.pprint(d1_f)
        #d1 = Counter(d1)
        #pprint.pprint(d1)

        l2 = N_grams(str1,2)

        word_count2 = {}

        for word in l2:
            if word in word_count2:
                word_count2[word] += 1
            else:
                word_count2[word] = 1
        
        c = Counter(word_count2)

        # returns the most occurring elements
        t = c.most_common(500)
        d2_l = []
        #print(len(t))
        for i in range(len(t)):
            density = (t[i][1]/len(l))*100
            d2_d = {}
            d2_d['keyword'] = t[i][0]
            d2_d['density'] = density
            d2_d['count'] = t[i][1]
            d2_l.append(d2_d)
            #d2[t[i][0]] = density
        d2_f = {"Two word" : d2_l}
        #pprint.pprint(d2_f)
        #d2 = Counter(d2)
        #pprint.pprint(d2)

        l3 = N_grams(str1,3)

        word_count3 = {}

        for word in l3:
            if word in word_count3:
                word_count3[word] += 1
            else:
                word_count3[word] = 1
        
        c = Counter(word_count3)

        # returns the most occurring elements
        t = c.most_common(1000)
        d3_l = []
        #print(len(t))
        for i in range(len(t)):
            density = (t[i][1]/len(l))*100
            d3_d = {}
            d3_d['keyword'] = t[i][0]
            d3_d['density'] = density
            d3_d['count'] = t[i][1]
            d3_l.append(d3_d)
            #d3[t[i][0]] = density
        d3_f = {"Three word" : d3_l}
        #pprint.pprint(d3_f)
        #d3 = Counter(d3)
        #pprint.pprint(d3)
        #d3 = dict(d3)
    #return render_template('index.html', prediction = "Number of words including stop words: {}  Number of words without stop words: {} \n Number of unique words without stop words: {} \n {}".format(len(l),len(words),len(unique_nosw),f))
    return jsonify(d1_f,d2_f,d3_f)

#"Abstract" : "Number of words including stop words: " +  str(len(l)) + "       " + "Number of unique words including stop words:" +  str(len(unique_sw)), 
def N_grams(text,n):
    tokens = re.split("\\s+",text)
    ngrams = []
    for i in range(len(tokens)-n+1):
        temps = [tokens[j] for j in range(i,i+n)]
        ngrams.append(" ".join(temps))
    return ngrams


if __name__ == '__main__':
	app.run(debug=True)