# -*- coding: utf-8 -*-

from itertools import combinations

def it_first(it):
    try:
        return next(iter(it))
    except StopIteration:
        return None

class CardEnum:
    nums =   [		  3,4,5,6,7,8,9,	10,	11,	12,	13,	14,		16,	17,		18]
    colors = [		  4,4,4,4,4,4,4, 	4, 	4, 	4, 	4, 	4, 		4, 	1, 		1]
    strs =   [0,'A',2,3,4,5,6,7,8,9,	'X','J','Q','K','A',0,	2,	'u',	'V']


class Card(int):
    ''' 单张牌, int 类型拓展 '''
    def __new__(cls, card):
        if card < 20:
            card = card * 10
        return super(Card, cls).__new__(cls, card)

    def __init__(self, a):
        # int.__init__(self, a)
        self.x = int(self/10)
        self.color = int(self-self.x*10)

    def __repr__(self):
        return str(CardEnum.strs[self.x])

    def __eq__(self, the):
        if isinstance(the, Card):
            return self.x == the.x
        return int(self) == int(the)

    def __hash__(self):
        return self.x


def isKing(self):
    return self.x == 17 or self.x == 18


ALL_POKER = []
for i, rank in enumerate(CardEnum.nums):
    for c in range(CardEnum.colors[i]):
        ALL_POKER.append(Card(rank + float(c)/10))


def getAllPoker():
    ''' 得到一副牌 '''
    return ALL_POKER.copy()


class Poker(list):
    ''' 扑克牌组, 继承自 list 可直接串行化 '''
    def __new__(cls, cards):
        cards = map(lambda a: Card(a), cards)
        # print('__new__', list(map(lambda c: type(c), cards)))
        return super(Poker, cls).__new__(cls, cards)

    ''' 牌组, Card 类型 list '''
    def __init__(self, cards):
        list.__init__(self)
        cards = map(lambda a: Card(a), cards)
        self.extend(cards)
        self.sort()
        self._xy = list(self.iter_xy())
        self._dictxy = dict(self.iter_xy())

    def __sub__(self, the):
        nums = list(the)
        remaind = []
        for v in self:
            if not v in nums:
                remaind.append(v)
            else:
                nums.remove(v)
        return remaind

    def isContain(self, cards):
        for c in cards:
            if self.count(c) == 0:
                return False
        return True

    def getY(self, x):
        ''' 得到 x 对应的 y '''
        return self._dictxy.get(x, 0)

    def xs(self):
        return (x for x,y in self.iter_xy())

    def hasRect(self, width, y, xmin=None):
        ''' 是否包含矩形 '''
        xmin = xmin or it_first(self).x
        for x in range(xmin, xmin + width):
            if not self.getY(x) >= y:
                return False
        return True

    def iterFlipRect(self, width, y, xmin=None):
        ''' 迭代裁切矩形 '''
        xmin = xmin or it_first(self).x
        for x in self.xs():
            if x >= xmin and self.hasRect(width, y, x):
                yield self.flipRect(width, y, x)

    def isComprise(self, y, num):
        ''' 是否由指定数组成 '''
        if len(self) != y*num:
            return False
        if num == 0:
            return True
        for _y in self._dictxy.values():
            if _y < y:
                return False
        return True

    def iterFromYmin(self, ymin, xmin=None):
        ''' 从 y 最小的迭代 '''
        xmin = xmin or it_first(self).x
        for i in range(ymin, 5):
            for x, y in self.iter_xy():
                if xmin <= x and y == i:
                    yield x

    def iterTails(self, num, y):
        ''' 迭代尾巴 '''
        for cards in combinations(self, num):
            cards = Poker(cards)
            width, _y = cards.rect()
            if _y == y:
                yield cards

    def flipRect(self, width, y, xmin):
        ''' 裁剪矩形 '''
        rectCards = []
        for x in range(xmin, xmin + width):
            rectCards += list(self.pickCards(x, y))
        return rectCards, self-rectCards

    def pickCards(self, x, num):
        ''' 取 '''
        if self.getY(x) >= num:
            for c in self:
                if x == c.x and num > 0:
                    num -= 1
                    yield c

    def rect(self, width=0, y=None):
        ''' 矩形 '''
        for x, _y in self.iter_xy():
            if y == None:
                y = _y
            if y and _y != y:
                return None, None
            width += 1
        return width, y

    def iter_xy(self):
        ''' x y 迭代 '''
        if hasattr(self, '_xy'):
            for v in self._xy:
                yield v
            return
        x = None
        num = 0
        for c in self:
            if x != c.x:
                if x != None:
                    yield x, num
                x = c.x
                num = 1
            else:
                num += 1
        if x != None:
            yield x, num

# c = Card(3.1)
# print(repr(c), c.color, c)
# pk = Poker([3,3,3,4,4,4])
# pk = Poker(pk)
# print(pk)
# print(list(pk.iter_xy()))
# print(list(pk.iterFlipRect(2, 3)))
# print(pk.isComprise(2, 3))
# print( pk._xy, Poker((3,3,3)).rect(), Poker((3,3,4)).rect(),
# 	pk.getY(4),
# 	pk.hasRect(1, 3),
# 	pk.hasRect(3, 3),
# 	pk.hasRect(2, 2),
# 	list(pk.pickCards(3, 2)),
# 	pk.flipRect(2,2,3),
# 	pk.isComprise(2, 3),
# '')
# print(list(pk.iterFlipRect(1,2, 3)))
# print(map(lambda a: a.color, pk))
