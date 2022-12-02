from pymatgen.core.structure import Structure, Molecule
from pymatgen.core.lattice import Lattice
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer, PointGroupAnalyzer
from pymatgen.io.vasp.inputs import Poscar
from pymatgen.symmetry.kpath import KPathSeek
from pymatgen.io.xyz import XYZ
import numpy as np
from build_surf import build_surface


def get_bulk_bz_coords(struc):
    recip_matrix = struc.lattice.reciprocal_lattice.matrix
    recip_inv_matrix = struc.lattice.reciprocal_lattice.inv_matrix
    bz = struc.lattice.get_brillouin_zone()

    coords = []
    for facet in bz:
        coords.extend(facet)

    coords = np.vstack(coords)
    unique_coords = np.unique(np.round(coords, 5), axis=0)

    mol = Molecule(
        coords=unique_coords,
        species=["C"] * len(unique_coords)
    )

    pg = PointGroupAnalyzer(mol)
    symops = pg.get_symmetry_operations()

    kp = KPathSeek(struc)
    kpoint_dict = {
        k: v for k, v in kp.kpath['kpoints'].items() if '_' not in k
    }

    all_high_symm_points = {}

    for k in kpoint_dict:
        high_symm_points = []
        for symop in symops:
            cart_point = symop.operate(
                np.array(kpoint_dict[k]).dot(recip_matrix)
            )
            high_symm_point = np.round(cart_point.dot(recip_inv_matrix), 5)
            high_symm_points.append(high_symm_point)

        unique_high_symm_points = np.unique(
            np.vstack(high_symm_points),
            axis=0
        )
        all_high_symm_points[k] = unique_high_symm_points

    kpoint_labels = []
    kpoint_values = []
    for k, v in all_high_symm_points.items():
        kpoint_labels.extend([k] * len(v))
        kpoint_values.append(v)

    return kpoint_labels, np.vstack(kpoint_values)


def get_surf_bz_coords(bulk, index):
    struc = build_surface(bulk, index)
    recip_matrix = struc.lattice.reciprocal_lattice.matrix
    recip_inv_matrix = struc.lattice.reciprocal_lattice.inv_matrix
    bz = struc.lattice.get_brillouin_zone()

    coords = []
    for facet in bz:
        frac_coords = np.vstack(facet).dot(recip_inv_matrix)
        frac_coords[:, -1] = 0.0
        cart_coords = frac_coords.dot(recip_matrix)
        coords.append(cart_coords)

    coords = np.vstack(coords)
    unique_coords = np.unique(np.round(coords, 5), axis=0)

    mol = Molecule(
        coords=unique_coords,
        species=["C"] * len(unique_coords)
    )

    pg = PointGroupAnalyzer(mol)
    symops = pg.get_symmetry_operations()

    kp = KPathSeek(struc)
    kpoint_dict = {
        k: v for k, v in kp.kpath['kpoints'].items() if '_' not in k and v[-1] == 0
    }

    all_high_symm_points = {}

    for k in kpoint_dict:
        high_symm_points = []
        for symop in symops:
            cart_point = symop.operate(
                np.array(kpoint_dict[k]).dot(recip_matrix)
            )
            high_symm_point = np.round(cart_point.dot(recip_inv_matrix), 5)
            high_symm_points.append(high_symm_point)

        unique_high_symm_points = np.unique(
            np.vstack(high_symm_points),
            axis=0
        )
        all_high_symm_points[k] = unique_high_symm_points

    kpoint_labels = []
    kpoint_values = []
    for k, v in all_high_symm_points.items():
        kpoint_labels.extend([k] * len(v))
        kpoint_values.append(v)

    return kpoint_labels, np.vstack(kpoint_values)


if __name__ == "__main__":
    struc = Structure.from_file('./POSCAR_CdTe_prim')
    bulk_bz_labels, bulk_bz_values = get_bulk_bz_coords(struc=struc)
    surf_bz_labels, surf_bz_values = get_surf_bz_coords(
        bulk=struc, index=[1, 1, 1])

    # print(bulk_bz_labels)
    # print(surf_bz_values.shape)
