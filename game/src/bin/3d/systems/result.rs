use bevy::prelude::{
    Assets, Handle, Mesh, Query, ResMut,  With, Mat4, Vec3,
    KeyCode, Input, Res
};
use meshtext::{MeshGenerator, MeshText, TextSection};
use crate::components::{text_result::ScoreboardText, scoreboard::Scoreboard};


static FONT_BYTES: &[u8] = include_bytes!("../../../../assets/fonts/RenegadePursuit.ttf");
// static GENERATOR:MeshGenerator<Face<'_>> = ;

pub fn update_result(
    keyboard_input: Res<Input<KeyCode>>,
    mesh_query: Query<&Handle<Mesh>, With<ScoreboardText>>,
    mut meshes: ResMut<Assets<Mesh>>,
    scoreboard: ResMut<Scoreboard>,
) {
    if !keyboard_input.just_pressed(KeyCode::D) || !scoreboard.start {
        return;
    }
    mesh_query.for_each(|mesh_handle| {
        let text = scoreboard.left.to_string();

        let text_mesh: MeshText = MeshGenerator::new(FONT_BYTES) 
            .generate_section(&text, false, Some(&Mat4::from_scale(Vec3::splat(0.5)).to_cols_array()))
            .unwrap();

        let vertices = text_mesh.vertices;
        let positions: Vec<[f32; 3]> = vertices.chunks(3).map(|c| [c[0], c[1], c[2]]).collect();
        let uvs = vec![[0f32, 0f32]; positions.len()];
        let mesh = meshes.get_mut(mesh_handle).unwrap();
        mesh.insert_attribute(Mesh::ATTRIBUTE_POSITION, positions);
        mesh.insert_attribute(Mesh::ATTRIBUTE_UV_0, uvs);
        mesh.compute_flat_normals();
    });
}


