#!/home/ddardzin/.local/miniconda3/bin/python
import numpy as np
from pymatgen.core.structure import Structure
from pymatgen.symmetry.kpath import KPathSeek
from pymatgen.io.vasp.inputs import Kpoints
import os
import argparse
import warnings


st = Structure.from_file('POSCAR_CdTe_prim')
kp = KPathSeek(st)

print(kp.kpath['kpoints'])
