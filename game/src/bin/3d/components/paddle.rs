#![allow(dead_code)]
use bevy::prelude::Component;

impl PaddleSide {

    pub fn switch(&mut self) {
        *self = match self {
            PaddleSide::Left => PaddleSide::Right,
            PaddleSide::Right => PaddleSide::Left,
        };
    }
}

#[derive(PartialEq)]
pub enum PaddleSide {
    Left,
    Right,
}

#[derive(Component)]
pub struct Paddle {
    side: PaddleSide,
}

impl Paddle {
    fn new(side: PaddleSide) -> Self {
        Self { side }
    }
    fn default() -> Self {
        Self::new(PaddleSide::Left)
    }

    pub fn left() -> Self {
        Self::new(PaddleSide::Left)
    }

    pub fn right() -> Self {
        Self::new(PaddleSide::Right)
    }
}
