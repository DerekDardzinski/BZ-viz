# Import flask and datetime module for showing date and time
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
from pymatgen.core.structure import Structure
from pymatgen.symmetry.kpath import KPathSeek
from get_bz_data import get_bulk_bz_coords, get_surf_bz_coords
from build_surf import build_surface
import datetime
import copy


def get_hex(center, r, z_height=0, extra_shift=np.zeros(2), theta=0):
    xy = r * np.array([
        [1, 0],
        [1/2, np.sqrt(3)/2],
        [-1/2, np.sqrt(3)/2],
        [-1, 0],
        [-1/2, -np.sqrt(3)/2],
        [1/2, -np.sqrt(3)/2],
        [1, 0],
    ]) + center

    theta *= np.pi / 180

    R = np.array([
        [np.cos(theta), -np.sin(theta)],
        [np.sin(theta), np.cos(theta)],
    ])

    inds = np.arange(len(xy), dtype=int)

    vertex_inds = [
        [int(inds[0]), int(b), int(c)] for b, c in zip(inds[1:], inds[2:])
    ]

    in_plane_coords = (xy @ R.T) + extra_shift

    three_coords = np.c_[
        in_plane_coords[:, 0],
        np.zeros(len(in_plane_coords)),
        in_plane_coords[:, 1]
    ]

    normals = np.c_[
        np.zeros(len(in_plane_coords)),
        np.ones(len(in_plane_coords)) + z_height,
        np.zeros(len(in_plane_coords))
    ]

    return np.ravel(three_coords).tolist(), np.ravel(vertex_inds).tolist(), np.ravel(normals).tolist()


def get_distorted_hex(center, r, z_height=0, extra_shift=np.zeros(2), theta=0, flip=False):
    xy = r * np.array([
        [-1, -(4/6) * np.sqrt(3)],
        [1, -(4/6) * np.sqrt(3)],
        [3/2, -(1/6) * np.sqrt(3)],
        [1/2, (5/6) * np.sqrt(3)],
        [-1/2, (5/6) * np.sqrt(3)],
        [-3/2, -(1/6) * np.sqrt(3)],
        [-1, -(4/6) * np.sqrt(3)],
    ])

    if flip:
        R90 = np.array([
            [np.cos(np.pi), -np.sin(np.pi)],
            [np.sin(np.pi), np.cos(np.pi)]
        ])
        xy = xy @ R90.T

    xy += np.array(center)

    theta *= np.pi / 180

    R = np.array([
        [np.cos(theta), -np.sin(theta)],
        [np.sin(theta), np.cos(theta)],
    ])

    inds = np.arange(len(xy), dtype=int)
    vertex_inds = [
        [int(inds[0]), int(b), int(c)] for b, c in zip(inds[1:], inds[2:])
    ]

    in_plane_coords = (xy @ R.T) + extra_shift

    three_coords = np.c_[
        in_plane_coords[:, 0],
        np.zeros(len(in_plane_coords)),
        in_plane_coords[:, 1]
    ]

    normals = np.c_[
        np.zeros(len(in_plane_coords)),
        np.ones(len(in_plane_coords)) + z_height,
        np.zeros(len(in_plane_coords))
    ]

    return np.ravel(three_coords).tolist(), np.ravel(vertex_inds).tolist(), np.ravel(normals).tolist()


def get_bz_data(struc, frac_shifts, vec1, vec2, issurf=False, miller_index=[1, 1, 1]):
    # matrix = struc.lattice.matrix
    if issurf:
        bulk_struc = copy.deepcopy(struc)
        struc = build_surface(struc=struc, index=miller_index)

    bz = struc.lattice.get_brillouin_zone()
    bz = copy.deepcopy(bz)
    recip_lattice = struc.lattice.reciprocal_lattice
    recip_matrix = copy.deepcopy(recip_lattice.matrix)
    reciprocal_vector_lengths = np.linalg.norm(recip_matrix, axis=1)
    normalized_reciprocal_vectors = recip_matrix / \
        reciprocal_vector_lengths[:, None]
    shifts = frac_shifts.dot(recip_lattice.matrix)

    rotation_vector_1 = vec1.dot(recip_lattice.matrix)
    rotation_vector_1 /= np.linalg.norm(rotation_vector_1)
    rotation_vector_2 = vec2

    if issurf:
        tmp_kpoint_labels, kpoint_frac_coords = get_surf_bz_coords(
            bulk=bulk_struc,
            index=miller_index,
        )
    else:
        tmp_kpoint_labels, kpoint_frac_coords = get_bulk_bz_coords(
            struc=struc
        )

    kpoint_labels = []
    for l in tmp_kpoint_labels:
        if 'GAMMA' in l:
            kpoint_labels.append('G' + "\n\n\n")
        else:
            if issurf:
                kpoint_labels.append(l + "\n\n\n")
            else:
                kpoint_labels.append(l)

    if issurf:
        reciprocal_vector_lengths = reciprocal_vector_lengths[:2]
        normalized_reciprocal_vectors = normalized_reciprocal_vectors[:2]

    kpoint_cart_coords = kpoint_frac_coords.dot(recip_lattice.matrix)

    vertices_inds = []
    plane_normals = []

    start_ind = 0

    for facet_coords in bz:
        facet_norm = np.cross(
            facet_coords[1] - facet_coords[0],
            facet_coords[2] - facet_coords[0]
        )

        if np.linalg.norm(facet_norm + facet_coords[0]) < np.linalg.norm(facet_norm):
            facet_norm *= -1

        plane_normals.append(facet_norm / np.linalg.norm(facet_norm))
        inds = np.arange(len(facet_coords), dtype=int) + start_ind
        vertices_inds.extend([
            [int(inds[0]), int(b), int(c)] for b, c in zip(inds[1:], inds[2:])
        ])
        start_ind += len(inds)

    vertices_inds = np.array(vertices_inds)
    vertices_coords = np.vstack(bz)

    vertex_coords = np.ravel(0.999*vertices_coords).tolist()
    vertex_inds = np.ravel(vertices_inds).tolist()
    shifts = shifts.tolist()
    plane_normals = np.ravel(plane_normals).tolist()

    return_dict = {
        "vertexCoords": vertex_coords,
        "vertexInds": vertex_inds,
        "shifts": shifts,
        "planeNormals": plane_normals,
        "reciprocalVectors": normalized_reciprocal_vectors.tolist(),
        "reciprocalVectorLengths": reciprocal_vector_lengths.tolist(),
        "kpointFracCoords": kpoint_frac_coords.tolist(),
        "kpointCartCoords": kpoint_cart_coords.tolist(),
        "kpointLabels": kpoint_labels,
        "rotationVector1": rotation_vector_1.tolist(),
        "rotationVector2": rotation_vector_2.tolist()
    }

    return return_dict


bulk = Structure.from_file('./POSCAR_CdTe_prim')
bulk_frac_shifts = np.array([
    [0, 0, 0],
    # [1, 0, 0],
    # [0, 1, 0],
    # [0, 0, 1],
    # [-1, 0, 0],
    # [0, -1, 0],
    # [0, 0, -1],
    # [1, -1, 0],
    # [0, 1, -1],
    # [1, 0, -1],
    # [-1, 1, 0],
    # [0, -1, 1],
    # [-1, 0, 1],
    # [1, 1, 1],
    # [-1, -1, -1],
])
bulk_vec1 = np.array([0, 0, 1])
bulk_vec2 = np.array([0, 1, 0])

surf = Structure.from_file('./POSCAR_CdTe_slab_conv')
surf_frac_shifts = np.array([
    [0, 0, 0],
    # [0, 0, 1],
    # [0, 0, -1],
    # [1, 0, 0],
    # [0, 1, 0],
    # [-1, 0, 0],
    # [0, -1, 0],
    # [-1, 1, 0],
    # [1, -1, 0],
])
surf_vec1 = np.array([0, 0, 1])
surf_vec2 = np.array([0, 1, 0])

# vc, vi, shifts, scale, norms = get_bz_data(bulk)

# x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app, supports_credentials=False)

# Route for seeing a data


@app.route('/bulkData')
def get_bulk_data():
    return get_bz_data(bulk, frac_shifts=bulk_frac_shifts, vec1=bulk_vec1, vec2=bulk_vec2)


@app.route('/surfData')
def get_surf_data():
    return get_bz_data(bulk, frac_shifts=surf_frac_shifts, vec1=surf_vec1, vec2=surf_vec2, issurf=True, miller_index=[1, 1, 0])


@app.route('/file', methods=['POST'])
@cross_origin(supports_credentials=False)
def upload_file():
    file = request.files['file']
    file.headers.add('Access-Control-Allow-Origin', '*')
    file.save(file.filename)
    struc = Structure.from_file(file.filename)
    data_bulk = get_bz_data(
        struc,
        frac_shifts=bulk_frac_shifts,
        vec1=np.array([0, 1, 0]),
        vec2=np.array([0, 1, 0]),
        issurf=False,
    )
    data_001 = get_bz_data(
        struc,
        frac_shifts=bulk_frac_shifts,
        vec1=np.array([0, 1, 0]),
        vec2=np.array([0, 1, 0]),
        issurf=True,
        miller_index=[0, 0, 1],
    )
    data_110 = get_bz_data(
        struc,
        frac_shifts=bulk_frac_shifts,
        vec1=np.array([0, 1, 0]),
        vec2=np.array([0, 1, 0]),
        issurf=True,
        miller_index=[1, 1, 0],
    )
    data_111 = get_bz_data(
        struc,
        frac_shifts=bulk_frac_shifts,
        vec1=np.array([0, 1, 0]),
        vec2=np.array([0, 1, 0]),
        issurf=True,
        miller_index=[1, 1, 1],
    )

    return_dict = {
        'bulk': data_bulk,
        'surf001': data_001,
        'surf110': data_110,
        'surf111': data_111,
    }

    return jsonify(return_dict)


@ app.route('/slices')
def get_slices():
    bz = bulk.lattice.get_brillouin_zone()
    recip_lattice = bulk.lattice.reciprocal_lattice

    height_vec = np.array([0.5, 0.5, 0.5]).dot(recip_lattice.matrix)
    height = np.linalg.norm(height_vec)

    for facet in bz:
        if len(facet) == 6:
            scale = np.linalg.norm(facet[0] - facet[3]) / 2
            break

    half_vert_dist = scale * (5/6) * np.sqrt(3)
    half_vert_hex = scale * (1/2) * np.sqrt(3)

    thetas_bottom = [0, 60, 120, 180, 240, 300]
    thetas_top = [0, 120, 240]

    zero_r = scale * 1.5
    norm_r = scale * 1

    coords = []
    inds = []
    normals = []

    c0, i0, n0 = get_hex(center=[0, 0], r=zero_r, z_height=0)
    coords.append(c0)
    inds.append(i0)
    normals.append(n0)

    for theta in thetas_bottom:
        c0i, i0i, n0i = get_hex(
            center=[scale * 2, -1.5 * (half_vert_hex + half_vert_dist)],
            r=zero_r,
            theta=theta,
            z_height=0,
        )
        coords.append(c0i)
        inds.append(i0i)
        normals.append(n0i)

    c05, i05, n05 = get_distorted_hex(
        center=[0, 0], r=norm_r, z_height=0.5 * height)
    coords.append(c05)
    inds.append(i05)
    normals.append(n05)

    for theta in thetas_top:
        c05i, i05i, n05i = get_hex(
            center=[0, (half_vert_hex + half_vert_dist)],
            r=norm_r,
            theta=theta,
            z_height=0.5 * height,
        )
        coords.append(c05i)
        inds.append(i05i)
        normals.append(n05i)

        c05j, i05j, n05j = get_distorted_hex(
            center=[0, - scale * (4/3) * np.sqrt(3)],
            r=norm_r,
            theta=theta,
            z_height=0.5 * height,
            flip=True
        )
        coords.append(c05j)
        inds.append(i05j)
        normals.append(n05j)

    c1, i1, n1 = get_hex(center=[0, 0], r=norm_r, z_height=height)
    coords.append(c1)
    inds.append(i1)
    normals.append(n1)
    for theta in thetas_bottom:
        c1i, i1i, n1i = get_distorted_hex(
            center=[0, -(half_vert_hex + half_vert_dist)],
            r=norm_r,
            theta=theta,
            z_height=height,
        )
        coords.append(c1i)
        inds.append(i1i)
        normals.append(n1i)

    return {}


# Running app
if __name__ == '__main__':
    app.run(debug=True)
