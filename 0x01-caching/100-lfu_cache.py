#!/usr/bin/python3
""" LFU Caching
"""


from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LFUCache class:
        caching system following LFU caching policy
    """
    recent_counter = 0

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
                    sorted(self.__usage_freq.items(), key=lambda it: (it[1]['frequency'], it[1]['recent'])))
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
        """ update usage freq and recent for key"""
        exist_key = self.__usage_freq.get(key)
        # print('freq---------', exist_key)

        # self.__usage_freq[key].frequency = 1 if freq is None else freq + 1
        if exist_key:
            self.__usage_freq[key]['frequency'] = self.__usage_freq[key]['frequency'] + 1
        else:
            self.__usage_freq[key] = {}
            self.__usage_freq[key]['frequency'] = 1
        self.__usage_freq[key]['recent'] = 1
        LFUCache.recent_counter += 1
        # print(self.__usage_freq[key])
