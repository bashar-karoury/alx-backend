#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """ method should return a dictionary with the following keys:
            index: the current start index of the return page.
            next_index: the next index to query with.
            page_size: the current page size
            data: the actual page of the dataset
        """
        # Sanitize index
        length = len(self.__indexed_dataset)
        assert (index < length)

        # Sanitize page_size
        assert (page_size > 1)

        # sort indexed_dataset
        sorted_indexed_dataset = sorted(self.__indexed_dataset)

        result_dict = {}
        data = []

        # index: the current start index of the return page.
        # next_index: the next index to query with.

        start = (index // page_size) * page_size
        end = start + page_size if start + page_size < length else None

        result_dict['index'] = start
        result_dict['next_index'] = end

        # page_size: the current page size

        # data: the actual page of the dataset
        try:
            for _ in range(start, end):
                data.append(self.__indexed_dataset.get(
                    sorted_indexed_dataset[_]))
        except IndexError:
            pass
        result_dict['page_size'] = len(data)
        result_dict['data'] = data

        return result_dict
