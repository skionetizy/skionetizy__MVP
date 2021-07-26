from gingerit.gingerit import GingerIt

text = 'were r u?'

parser = GingerIt()
x=parser.parse(text)
import pickle
pickle.dump(parser, open('gram_check.pickle', 'wb'))