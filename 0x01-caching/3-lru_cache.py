#!/usr/bin/python3
""" LRU Caching
"""


from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ LRUCache class:
        caching system following LRU caching policy
    """
    freq_counter = 0

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.__usage_freq = {}

    def put(self, key, item):
        """ Add an item in the cache
            If key or item is None, nothing would be added
        """

        if key and item:
            if key in self.cache_data:
                self.cache_data[key] = item
                self.update(key)
                return
            length = len(self.cache_data)
            if length >= self.MAX_ITEMS:
                # get LRU element
                sorted_freq = dict(
                    sorted(self.__usage_freq.items(), key=lambda item: item[1]))
                discarded_key = list(sorted_freq)[0]
                # delete from cache
                del self.cache_data[discarded_key]
                # delete from usage frequency
                del self.__usage_freq[discarded_key]
                print(f'DISCARD: {discarded_key}')
            self.cache_data[key] = item
            self.update(key)

    def get(self, key):
        """ Get an item by key
            return the value linked to key if it exist, None otherwise
        """
        result = self.cache_data.get(key)
        if result:
            self.update(key)
        return result

    def update(self, key):
        """ update usage freq for key"""
        freq = self.__usage_freq.get(key)
        self.__usage_freq[key] = LRUCache.freq_counter
        LRUCache.freq_counter += 1
