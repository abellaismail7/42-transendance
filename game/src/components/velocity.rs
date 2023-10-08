use bevy::prelude::{Component, Deref, DerefMut, Vec2};

#[derive(Component, Deref, DerefMut)]
pub struct Velocity(pub Vec2);
