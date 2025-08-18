import math
import pytest
from calc import compute

def test_add():
    assert compute("add", 1, 2) == 3

def test_sub():
    assert compute("sub", 5, 3) == 2

def test_mul():
    assert compute("mul", 4, 2.5) == 10

def test_div():
    assert compute("div", 9, 3) == 3

def test_div_by_zero():
    with pytest.raises(ValueError):
        compute("div", 1, 0)

def test_bad_op():
    with pytest.raises(ValueError):
        compute("pow", 2, 3)
