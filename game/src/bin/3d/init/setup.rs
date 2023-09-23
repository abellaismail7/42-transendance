use bevy::prelude::*;

use crate::components::{
    ball::Ball, collider::Collider, config::Config, paddle::Paddle, velocity::Velocity,
    wall::WallBundle,
};

pub fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    config: Res<Config>,
) {
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0., 0., 7.).looking_at(Vec3::ZERO, Vec3::Y),
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
        )),
        ..default()
    });
    // cube
    commands.spawn((
        PbrBundle {
            mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
            material: materials.add(Color::rgb(0.8, 0.7, 0.6).into()),
            transform: Transform::from_xyz(0., 2.4, 0.1).with_scale(Vec3::new(1.0, 0.2, 0.2)),
            ..default()
        },
        Paddle::left(),
        Collider { scorable: false },
    ));
    commands.spawn((
        PbrBundle {
            mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
            material: materials.add(Color::rgb(0.8, 0.7, 0.6).into()),
            transform: Transform::from_xyz(0., -2.3, 0.1).with_scale(Vec3::new(1.0, 0.2, 0.2)),
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
        Transform::from_xyz(0., 2.5, 0.).with_scale(Vec3::new(5.0, 0.1, 0.2)),
        &mut meshes,
        &mut materials,
    ));
    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(0., -2.5, 0.).with_scale(Vec3::new(5.0, 0.1, 0.2)),
        &mut meshes,
        &mut materials,
    ));

    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(2.5, 0., 0.).with_scale(Vec3::new(0.1, 5.0, 0.2)),
        &mut meshes,
        &mut materials,
    ));

    commands.spawn(WallBundle::new_pbr(
        Transform::from_xyz(-2.5, 0., 0.).with_scale(Vec3::new(0.1, 5.0, 0.2)),
        &mut meshes,
        &mut materials,
    ));
}
