use bevy::prelude::{Res, Input, KeyCode, Query, With, Transform, FixedTime};
use crate::components::{paddle::Paddle, config::Config};


pub fn move_paddle(
    keyboard_input: Res<Input<KeyCode>>,
    mut query: Query<(&Paddle, &mut Transform), With<Paddle>>,
    time_step: Res<FixedTime>,
    config: Res<Config>,
) {
    //let paddle_transform = query.iter_mut().find(|it| it.0.side.is(a));
    let paddles = query.iter_mut();

    paddles.for_each(|paddle_transform|{


    if let Some((_, mut paddle_transform)) = Some(paddle_transform) {
        let mut direction = 0.0;

        if keyboard_input.pressed(KeyCode::Left) {
            direction -= 1.0;
        }

        if keyboard_input.pressed(KeyCode::Right) {
            direction += 1.0;
        }

        // Calculate the new horizontal paddle position based on player input
        let new_paddle_position = paddle_transform.translation.x
            + direction * config.ball_speed * time_step.period.as_secs_f32();

        // Update the paddle position,
        // making sure it doesn't cause the paddle to leave the arena
        /* let up_bound = -TOP_WALL + WALL_THICKNESS / 2.0 + PADDLE_SIZE.y / 2.0 + PADDLE_PADDING;
        let down_bound = -BOTTOM_WALL - WALL_THICKNESS / 2.0 - PADDLE_SIZE.y / 2.0 - PADDLE_PADDING; */
        let up_bound = -2.0;
        let down_bound = 2.0;

        paddle_transform.translation.x = new_paddle_position.clamp(up_bound, down_bound);
    }
  })
}
