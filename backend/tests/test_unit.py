from backend.store import next_id


def test_next_id_uses_highest_record_even_when_unsorted():
    assert next_id([{"id": 8}, {"id": 2}, {"id": 5}]) == 9
    assert next_id([], initial=101) == 101
