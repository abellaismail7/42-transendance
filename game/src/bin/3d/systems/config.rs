
use bevy::prelude::{ResMut, GizmoConfig, Input, KeyCode, Res};

pub fn update_config(mut config: ResMut<GizmoConfig>, keyboard: Res<Input<KeyCode>>) {
    if keyboard.just_pressed(KeyCode::D) {
        config.depth_bias = if config.depth_bias == 0. { -1. } else { 0. };
    }
    if keyboard.just_pressed(KeyCode::P) {
        // Toggle line_perspective
        config.line_perspective ^= true;
        // Increase the line width when line_perspective is on
        config.line_width *= if config.line_perspective { 5. } else { 1. / 5. };
    }
}
