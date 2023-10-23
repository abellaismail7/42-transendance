use bevy::prelude::*;
use meshtext::{MeshGenerator, MeshText, TextSection};

use crate::components::{
    ball::Ball, collider::Collider, config::Config, paddle::{Paddle, PaddleSide}, velocity::Velocity,
    wall::WallBundle, scoreboard, text_result::ScoreboardText,
};

pub fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    asset_server: Res<AssetServer>,
    config: Res<Config>,
    scoreboard: Res<scoreboard::Scoreboard>,
) {
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0., 0., 9.).looking_at(Vec3::ZERO, Vec3::Y),
        ..default()
    });
    // plane
    commands.spawn(PbrBundle {
        mesh: meshes.add(Mesh::from(shape::Plane::from_size(5.0))),
        material: materials.add(Color::rgb(0.3, 0.5, 0.3).into()),
        transform: Transform::from_rotation(Quat::from_euler(
            EulerRot::XYZ,
            (90.0_f32).to_radians(),
            (0.0_f32).to_radians(),
            (0.0_f32).to_radians(),
        )).with_scale(Vec3::new(5.0, 5.0, 5.0)),
        ..default()
    });
    // padddles
    commands.spawn((
        PbrBundle {
            mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
            material: materials.add(Color::rgb(0.8, 0.7, 0.6).into()),
            transform: Transform::from_xyz(4.5, 0.0, 0.1).with_scale(Vec3::new(0.2, 1.0, 0.2)),
            ..default()
        },
        Paddle::left(),
        Collider { scorable: false },
    ));
    commands.spawn((
        PbrBundle {
            mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
            material: materials.add(Color::rgb(0.8, 0.7, 0.6).into()),
            transform: Transform::from_xyz(-4.5, 0.0, 0.1).with_scale(Vec3::new(0.2, 1., 0.2)),
            ..default()
        },
        Paddle::right(),
        Collider { scorable: false },
    ));

    // ball
    commands.spawn((
        PbrBundle {
           mesh: meshes.add(Mesh::from(shape::UVSphere {
                radius: 1.0,
                ..default()
            })),
            material: materials.add(Color::rgb(0.8, 0.7, 0.6).into()),
            transform: Transform::from_xyz(0.0, 0.0, 0.1).with_scale(config.ball_size),
            ..default()
        },
        Ball,
        Velocity(config.initial_ball_direction.normalize() * config.ball_speed),
    ));
    // light
    commands.spawn(PointLightBundle {
        point_light: PointLight {
            intensity: 1500.0,
            shadows_enabled: true,
            ..default()
        },
        transform: Transform::from_xyz(4.0, 8.0, 4.0),
        ..default()
    });

    // WALLS
    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(0., 2.5, 0.).with_scale(Vec3::new(9.1, 0.1, 0.2)),
        &mut meshes,
        &mut materials,
    ));

    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(0., -2.5, 0.).with_scale(Vec3::new(9.1, 0.1, 0.2)),
        &mut meshes,
        &mut materials,
    ));

    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(4.5, 0., 0.).with_scale(Vec3::new(0.1, 5.0, 0.2)),
        &mut meshes,
        &mut materials,
    ))
    .insert(Collider { scorable: true });

    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(-4.5, 0., 0.).with_scale(Vec3::new(0.1, 5.0, 0.2)),
        &mut meshes,
        &mut materials,
    ))
    .insert(Collider { scorable: true });

    let font = asset_server.load("fonts/sporttype.ttf");
    let text_style = TextStyle {
        font,
        font_size: 20.0,
        color: Color::WHITE,
    };

    commands.spawn((
        TextBundle {
            text: Text::from_section("Ping Pong", text_style)
                .with_alignment(TextAlignment::Center),
            transform: Transform::from_translation(Vec3::new(4., 0., 4.)),
            ..default()
        }
        .with_style(Style {
            position_type: PositionType::Absolute,
            top: Val::Px(12.0),
            left: Val::Px(12.0),
            ..default()
        }),
    ));

    //render_text(&mut commands, &mut meshes, "START", )

    let (mesh, xcenter) = get_text_mesh("START", 0.5);
    commands
        .spawn(PbrBundle {
                mesh: meshes.add(mesh),
                material: materials.add(Color::rgb(1., 1., 1.).into()),
                // transform mesh so that it is in the center
                transform: Transform::from_translation(Vec3::new(
                    xcenter,
                    0.,
                    -0.2,
                )),
            ..Default::default()
        });
    let (mesh, xcenter) = get_text_mesh(scoreboard.left.to_string().as_str(), 0.5);
    commands
        .spawn(PbrBundle {
                mesh: meshes.add(mesh),
                material: materials.add(Color::rgb(1., 1., 1.).into()),
                // transform mesh so that it is in the center
                transform: Transform::from_translation(Vec3::new(
                    xcenter - 2.0,
                    0.,
                    -0.2,
                )),
            ..Default::default()
        })
        .insert(ScoreboardText::new(PaddleSide::Left));

    let (mesh, xcenter) = get_text_mesh(scoreboard.right.to_string().as_str(), 0.5);
    commands
        .spawn(PbrBundle {
                mesh: meshes.add(mesh),
                material: materials.add(Color::rgba(1., 1., 1., 0.7).into()),
                // transform mesh so that it is in the center
                transform: Transform::from_translation(Vec3::new(
                    xcenter + 2.0 ,
                    0.,
                    -0.2,
                )),
            ..Default::default()
        })
        .insert(ScoreboardText::new(PaddleSide::Right));
}

/// set up a simple 3D scene with text
fn get_text_mesh(text: &str, text_size: f32) -> (Mesh, f32) {
    let font_data = include_bytes!("../../assets/fonts/RenegadePursuit.ttf");
    let mut generator = MeshGenerator::new(font_data);
    let text_mesh: MeshText = generator
        .generate_section(text, false, Some(&Mat4::from_scale(Vec3::splat(text_size)).to_cols_array()))
        .unwrap();

    let vertices = text_mesh.vertices;
    let positions: Vec<[f32; 3]> = vertices.chunks(3).map(|c| [c[0], c[1], c[2]]).collect();
    let uvs = vec![[0f32, 0f32]; positions.len()];

    let mut mesh = Mesh::new(bevy::render::render_resource::PrimitiveTopology::TriangleList);
    mesh.insert_attribute(Mesh::ATTRIBUTE_POSITION, positions);
    mesh.insert_attribute(Mesh::ATTRIBUTE_UV_0, uvs);
    mesh.compute_flat_normals();

    (mesh, text_mesh.bbox.size().x / -2f32)
}
