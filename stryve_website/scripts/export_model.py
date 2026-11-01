"""Export the PowerThru sleeve .blend to a web-ready GLB.

Requires a bpy matching the file's Blender version:  pip install bpy==5.0.1
Run from the project root:                            python3 scripts/export_model.py

What it does:
  * keeps only the render-visible product collections (sleeve, ribs, module,
    skin-side electrodes) — the proxy arm, the folded box / case variants,
    the cameras and the lights are dropped; the web scene has its own rig
  * flattens procedural base colours (which glTF cannot carry) to the flat
    colour the node tree feeds in, so nothing exports as default white
  * replaces the light bar (a 22 mm glowing strip authored with 268k faces
    that will not decimate) with its convex hull, which reads identically

  * Draco-compresses the geometry; the decoder is self-hosted from
    public/draco/ (copied from three/examples/jsm/libs/draco/gltf)
"""
import bpy
import bmesh  # noqa: E402 — must follow bpy

SRC = 'models/PowerThru_Sleeve.blend'
OUT = 'public/models/powerthru-sleeve.glb'

KEEP_COLLECTIONS = {'S10_Sleeve', 'S15_Ribs', 'S20_Module', 'S25_SkinSide'}
HULL = ['PTS_LightBar']

bpy.ops.wm.open_mainfile(filepath=SRC)

keep = set()
for col in bpy.data.collections:
    if col.name in KEEP_COLLECTIONS:
        keep.update(o.name for o in col.all_objects)

for obj in list(bpy.data.objects):
    if obj.name not in keep or obj.type != 'MESH':
        bpy.data.objects.remove(obj, do_unlink=True)

# Flatten any texture-driven base colour to a plain value glTF understands.
FLAT = {
    'PTS_Gripper_Obsidian': (0.007, 0.009, 0.012, 1.0),
    'PTS_Mesh_Carbon': (0.003, 0.004, 0.005, 1.0),
}
for mat in bpy.data.materials:
    if not mat.node_tree:
        continue
    bsdf = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if not bsdf:
        continue
    base = bsdf.inputs['Base Color']
    if base.is_linked:
        for link in list(base.links):
            mat.node_tree.links.remove(link)
        base.default_value = FLAT.get(mat.name, base.default_value)

for name in HULL:
    obj = bpy.data.objects.get(name)
    if obj:
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        hull = bmesh.ops.convex_hull(bm, input=bm.verts)
        bmesh.ops.delete(bm, geom=hull['geom_interior'] + hull['geom_unused'], context='VERTS')
        bm.to_mesh(obj.data)
        bm.free()
        print('hull', name, len(obj.data.polygons), 'faces')

bpy.ops.object.select_all(action='DESELECT')
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
for o in meshes:
    o.hide_set(False)
    o.hide_render = False
    o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_materials='EXPORT',
    export_cameras=False,
    export_lights=False,
    export_animations=False,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=10,
)
print('exported', OUT, len(meshes), 'meshes')
