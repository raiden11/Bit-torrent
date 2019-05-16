# import numpy as np 

# d = {'pooh':0, 'rabbit':0, 'piglet':0, 'Christopher':0, 'ayush': 0}
# d = {0: 0, 1: 0, 2:0, 3:0, 4:0, 6:0, 7:0, 8:0}
# cum_array = [0.5, 0.75, 0.875, 0.9375, 1.0]

# a = [[]]

# for i in range(1, 10000):

# 	a = np.random.choice(range(0, 5), 1, p = [0.5, 0.25, 0.125, 0.0625, 0.0625], replace = False)
# 	d[a[0]] += 1

# for k in d.keys():
# 	print(k, d[k])


import numpy as np

a = [1, 2, 3, 4, 5, 6, 7]
uploaders = np.random.choice(a, 10)
print(uploaders)

# import pickle 
# d = {0: 0, 1: 0, 2:0, 3:0, 4:0, 6:0, 7:0, 8:0}
# p = []
# p.append(d)
# p.append(d)

# f = open("hello.pickle", "wb")
# pickle.dump(p, f)
# f.close()

# f1 = open("hello.pickle", "rb")
# s = pickle.load(f1)
# f1.close()


# print(s == p)

