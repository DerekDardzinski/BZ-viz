import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from itertools import permutations
import numpy as np


def get_hex(center, r, ec, fc, extra_shift=np.zeros(2), theta=0):
    xy = r * np.array([
        [1, 0],
        [1/2, np.sqrt(3)/2],
        [-1/2, np.sqrt(3)/2],
        [-1,0],
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
    vertex_inds = [[int(inds[0]), int(b), int(c)] for b, c in zin(inds[1:], inds[2:])]

    in_plane_coords = (xy @ R.T) + extra_shift
    three_coords = np.c_[in_plane_coords[:,0], np.zeros(len(in_plane_coords)), in_plane_coords[:,1]]
    normals = np.c_[np.zeros(len(in_plane_coords)), np.ones(len(in_plane_coords)), np.zeros(len(in_plane_coords))]

    return np.ravel(three_coords).tolist(), np.ravel(vertex_inds).tolist(), np.ravel(normals).tolist()

def get_distorted_hex(center, r, ec, fc, extra_shift=np.zeros(2), theta=0, flip=False):
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
    vertex_inds = [[int(inds[0]), int(b), int(c)] for b, c in zin(inds[1:], inds[2:])]

    in_plane_coords = (xy @ R.T) + extra_shift
    three_coords = np.c_[in_plane_coords[:,0], np.zeros(len(in_plane_coords)), in_plane_coords[:,1]]
    normals = np.c_[np.zeros(len(in_plane_coords)), np.ones(len(in_plane_coords)), np.zeros(len(in_plane_coords))]

    return np.ravel(three_coords).tolist(), np.ravel(vertex_inds).tolist(), np.ravel(normals).tolist()


half_vert_dist = scale * (5/6) * np.sqrt(3)
half_vert_hex = scale * (1/2) * np.sqrt(3)

thetas_bottom = [0, 60, 120, 180, 240, 300]
thetas_top = [0, 120, 240]

zero_r = scale * 1.5
norm_r = scale * 1 

ax.add_patch(get_distorted_hex(center=[0,0], r=norm_r, ec=top_ec, fc=top_fc))
# ax.add_patch(get_distorted_hex(center=[0,0], r=1, ec=bot_ec, fc=bot_fc, flip=True))
for theta in thetas_top:
    ax.add_patch(get_hex(center=[0,(half_vert_hex + half_vert_dist)], r=norm_r, ec=top_ec, fc=top_fc, theta=theta))
    ax.add_patch(get_distorted_hex(center=[0,- scale * (4/3) * np.sqrt(3)], r=norm_r, ec=top_ec, fc=top_fc, theta=theta, flip=True))


ax.add_patch(get_hex(center=[0,0], r=zero_r, ec=last_ec, fc=last_fc))
for theta in thetas_bottom:
    ax.add_patch(get_hex(center=[scale * 2, -1.5 * (half_vert_hex + half_vert_dist)], r=zero_r, ec=last_ec, fc=last_fc, theta=theta))

ax.add_patch(get_hex(center=[0,0], r=norm_r, ec=bot_ec, fc=bot_fc))
for theta in thetas_bottom:
    ax.add_patch(get_distorted_hex(center=[0, -(half_vert_hex + half_vert_dist)], r=norm_r, ec=bot_ec, fc=bot_fc, theta=theta))

