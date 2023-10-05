use bevy::prelude::{
    Assets, Handle, Mesh, Query, ResMut,  Mat4, Vec3,
     EventReader
};
use meshtext::{MeshGenerator, MeshText, TextSection};
use crate::components::{text_result::{ScoreboardText, ScoreEvent}, scoreboard::Scoreboard, paddle::PaddleSide};


static FONT_BYTES: &[u8] = include_bytes!("../../../../assets/fonts/RenegadePursuit.ttf");
// static GENERATOR:MeshGenerator<Face<'_>> = ;

pub fn update_result(
    mesh_query: Query<(&Handle<Mesh>, &ScoreboardText)>,
    mut meshes: ResMut<Assets<Mesh>>,
    scoreboard: ResMut<Scoreboard>,
    mut score_event: EventReader<ScoreEvent>,
) {
    let iter = score_event.iter();
    if iter.len() == 0 { return; }
    println!("update_result");
    let ev = iter.last().expect("No score event");
    mesh_query.for_each(|(mesh_handle, score_text)| {
        if score_text.side != ev.1 { return;}
        let text = if score_text.side == PaddleSide::Left { scoreboard.left.to_string()} else { scoreboard.right.to_string() } ;

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
