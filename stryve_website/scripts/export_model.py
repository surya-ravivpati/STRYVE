"""Export the STRYVE wearable .blend to a web-ready GLB.

Requires a bpy matching the file's Blender version:  pip install bpy==5.0.1
Run from the project root:                            python3 scripts/export_model.py
"""
import bpy

SRC = 'models/PowerThru_Assembly_Reveal.blend'
OUT = 'public/models/stryve-wearable.glb'

bpy.ops.wm.open_mainfile(filepath=SRC)

# Drop cameras and lights — the web scene supplies its own studio rig.
for obj in list(bpy.data.objects):
    if obj.type in {'CAMERA', 'LIGHT'}:
        bpy.data.objects.remove(obj, do_unlink=True)

bpy.ops.object.select_all(action='DESELECT')
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
for o in meshes:
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
)
print('exported', OUT)
