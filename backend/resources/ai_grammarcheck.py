from gingerit.gingerit import GingerIt
import nltk
import pysbd, re 


segmentor = pysbd.Segmenter(language="en", clean=False)
subsegment_re = r'[^;:\n•]+[;,:\n•]?\s*'

def runGinger(par):
    fixed = []
    cor={'corrections':[],'result':'','text':''}
    for sentence in segmentor.segment(par):
        if len(sentence) < 10:
            fixed.append(GingerIt().parse(sentence)['result'])
            if len(GingerIt().parse(sentence)['corrections'])>0:
              cor['corrections'].append(GingerIt().parse(sentence)['corrections'])
        else:
            subsegments = re.findall(subsegment_re, sentence)
            if len(subsegments) == 1 or any(len(v) < 10 for v in subsegments):
                # print(f'Skipped: {sentence}') // No grammar check possible
                fixed.append(sentence)
            else:
                res = []
                for s in subsegments:
                    res.append(GingerIt().parse(s)['result'])
                    if len(GingerIt().parse(sentence)['corrections'])>0:
                      cor['corrections'].append(GingerIt().parse(sentence)['corrections'])
                fixed.append("".join(res))
    cor['result']=" ".join(fixed)
    cor['text']=par
    return cor
