use bevy::prelude::{Component, Event};

use super::paddle::PaddleSide;

#[derive(Event)]
pub struct ScoreEvent(pub u32, pub PaddleSide);

#[derive(Component)]
pub struct ScoreboardText{
    pub side: PaddleSide,
}

impl ScoreboardText {
    pub fn new(side: PaddleSide) -> Self {
        Self { side }
    }
}
