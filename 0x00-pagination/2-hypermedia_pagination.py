#!/usr/bin/env python3
"""
Hypermedia pagination
"""
import csv
import math
from typing import List


def index_range(page: int, page_size: int) -> tuple:
    """ functio  that takes two integer arguments page and page_size and
        return a tuple of size two containing a start index and an end
        index corresponding to the range of indexes to return in a list
        for those particular pagination parameters
    """
    return ((page - 1) * page_size, page * page_size)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """ mehtod that get specific page based on provided page_size"""
        # sanitize inputs
        assert (type(page) == int)
        assert (type(page_size) == int)

        assert (page > 0)
        assert (page_size > 0)

        self.dataset()
        start, end = index_range(page, page_size)
        result = []
        try:
            for i in range(start, end):
                result.append(self.__dataset[i])
        except IndexError:
            pass

        return result

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """ mehtod that get specific page based on provided page_size
            and return dictionry with size, data, next_page, prev_page and
            total pages
        """
        page_data = self.get_page(page, page_size)
        result_dict = {}
        total_pages = math.ceil(len(self.__dataset) / page_size)
        result_dict['page_size'] = len(page_data)
        result_dict['data'] = page_data
        result_dict['page'] = page
        result_dict['next_page'] = page + 1 if page <= total_pages else None
        result_dict['prev_page'] = page - 1 if page > 2 else None
        result_dict['total_pages'] = total_pages
        return result_dict
