#!/usr/bin/env python3
from rest_framework import parsers

import json

class MultiPartJsonParser(parsers.MultiPartParser):
    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )

        def _parse_key(data, key, value):
            if key.startswith('['):
                right_bracket_index = key.index(']')

                nested_key = key[1:right_bracket_index]

                if nested_key not in data:
                    data[nested_key] = {}

                key = key[right_bracket_index + 1:]

                if key:
                    return _parse_key(data[nested_key], key, value)

                key = nested_key

            try:
                data[key] = json.loads(value)
            except ValueError:
                data[key] = value

        data = {}

        for key, value in result.data.items():
            if '[' in key and ']' in key:
                # nested
                index_left_bracket = key.index('[')

                nested_dict_key = key[:index_left_bracket]

                if nested_dict_key not in data:
                    data[nested_dict_key] = {}

                _parse_key(data[nested_dict_key], key[index_left_bracket:], value)
            else:
                _parse_key(data, key, value)

        return parsers.DataAndFiles(data, result.files)
