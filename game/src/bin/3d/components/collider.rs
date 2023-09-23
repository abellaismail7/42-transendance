use bevy::prelude::{Component, Event};

#[derive(Event, Default)]
pub struct CollisionEvent;

#[derive(Component)]
pub struct Collider {
    pub scorable: bool,
}
