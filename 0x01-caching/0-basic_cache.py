#!/usr/bin/python3
""" Basic dictionary
"""


from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ BasicCache class:
        caching system doesn’t have limit
    """

    def put(self, key, item):
        """ Add an item in the cache
            If key or item is None, nothing would be added
        """
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """ Get an item by key
            return the value linked to key if it exist, None otherwise
        """
        return self.cache_data.get(key)
