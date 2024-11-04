#!/usr/bin/python3
""" LIFO caching
"""


from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ FIFOCache class:
        caching system following LIFO caching policy
    """

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.__fifo_dict = {}

    def put(self, key, item):
        """ Add an item in the cache
            If key or item is None, nothing would be added
        """

        if key and item:
            if key in self.cache_data:
                return
            length = len(self.cache_data)
            if length >= self.MAX_ITEMS:
                # get first added element
                discarded_key = list(self.cache_data)[-1]
                del self.cache_data[discarded_key]
                print(f'DISCARD: {discarded_key}')
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
            return the value linked to key if it exist, None otherwise
        """
        return self.cache_data.get(key)
