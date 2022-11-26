import scipy.optimize
import math


def himmelblau(x, y):
    return (x * x + y - 11) * ( x * x + y - 11) + (x + y * y - 7) * (x + y * y - 7)


def beale(x, y):
    return math.pow(1.5 - x + x*y, 2) + math.pow(2.25 - x + x*y*y, 2) + math.pow(2.625 - x + x*y*y*y, 2);

def main():
    if True:
        initial = [-3.670609291875735,3.8585484651848674]
        solution = scipy.optimize.fmin(lambda x: beale(x[0], x[1]),
                                       initial, retall=True)
        print "loss", beale(solution[0][0], solution[0][1])
    elif False:
        def banana(x, y):
            return (1 - x) * (1 - x) + 100 * (y - x * x) * ( y - x * x)

        initial = [-1.675793744623661,-1.945310341194272]
        solution = scipy.optimize.fmin(lambda x: banana(x[0], x[1]),
                                       initial, retall=True)

    elif False:
        initial = [4.474377192556858, 0.22207495383918285]
        initial = [-7.185110699385405, 0.01616438291966915]

        solution = scipy.optimize.fmin(lambda x: himmelblau(x[0], x[1]),
                                       initial, retall=True)
    else:
        solution = scipy.optimize.fmin(lambda x: (x[0]-10) * (x[0]-10), [0], retall=True)

    print solution[0]

    for i, s in enumerate(solution[1]):
        print str(i) + ":", s




if __name__ == "__main__":
    main()



