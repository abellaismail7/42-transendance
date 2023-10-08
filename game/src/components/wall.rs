use bevy::{
    prelude::{shape, Assets, Bundle, Color, Mesh, PbrBundle, ResMut, StandardMaterial, Transform},
    sprite::SpriteBundle,
    utils::default,
};

use super::collider::Collider;

// This bundle is a collection of the components that define a "wall" in our game
#[derive(Bundle)]
pub struct WallBundle {
    // You can nest bundles inside of other bundles like this
    // Allowing you to compose their functionality
    pub sprite_bundle: SpriteBundle,
    pub collider: Collider,
}

impl WallBundle {
    // This "builder method" allows us to reuse logic across our wall entities,
    // making our code easier to read and less prone to bugs when we change the logic
    pub fn new_pbr(
        tr: Transform,
        meshes: &mut ResMut<Assets<Mesh>>,
        materials: &mut ResMut<Assets<StandardMaterial>>,
    ) -> (PbrBundle, Collider) {
        (
            PbrBundle {
                mesh: meshes.add(Mesh::from(shape::Cube { size: 1.0 })),
                material: materials.add(Color::rgb(0.8, 0.7, 0.6).into()),
                transform: tr,
                ..default()
            },
            Collider { scorable: false },
        )
    }
}
