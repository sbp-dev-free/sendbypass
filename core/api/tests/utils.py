def encode_nested_dict(d, inner=False, empty='null'):
    out = {}

    def augment(k):
        if inner:
            return '[{}]'.format(k)

        return str(k)

    for k, v in d.items():
        if isinstance(v, dict):
            n = encode_nested_dict(v, True)

            for nk, nv in n.items():
                out['{}{}'.format(augment(k), nk)] = nv
        elif isinstance(v, list):
            for i, nv in enumerate(v):
                out['{}[{}]'.format(augment(k), str(i))] = nv
        elif v is None:
            out[augment(k)] = empty
        else:
            out[augment(k)] = v

    return out
