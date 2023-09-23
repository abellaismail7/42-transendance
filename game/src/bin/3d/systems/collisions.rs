use bevy::{
    prelude::{EventWriter, Query, ResMut, Transform, With, Without},
    sprite::collide_aabb::{collide, Collision},
};

use crate::components::{
    ball::Ball,
    collider::{Collider, CollisionEvent},
    scoreboard::Scoreboard,
    velocity::Velocity,
};

pub fn check_for_collisions(
    mut scoreboard: ResMut<Scoreboard>,
    mut ball_set: Query<(&mut Velocity, &mut Transform), With<Ball>>,
    collider_query: Query<(&Collider, &Transform), Without<Ball>>,
    mut collision_events: EventWriter<CollisionEvent>,
) {
    let (mut ball_velocity, mut ball_transform) = ball_set.single_mut();
    let ball_size = ball_transform.scale.truncate();

    // check collision with walls
    for (collider_entity, transform) in &collider_query {
        let collision = collide(
            ball_transform.translation,
            ball_size,
            transform.translation,
            transform.scale.truncate(),
        );
        if let Some(collision) = collision {
            // Sends a collision event so that other systems can react to the collision
            collision_events.send_default();

            // reflect the ball when it collides
            let mut reflect_x = false;
            let mut reflect_y = false;

            // only reflect if the ball's velocity is going in the opposite direction of the
            // collision
            match collision {
                Collision::Left => {
                    reflect_x = ball_velocity.x > 0.0;
                    if collider_entity.scorable {
                        scoreboard.left += 1;
                        scoreboard.start = false;
                        ball_transform.translation.x = 0.0;
                        ball_transform.translation.y = 0.0;
                    }
                    scoreboard.turn.switch();
                }
                Collision::Right => {
                    reflect_x = ball_velocity.x < 0.0;
                    if collider_entity.scorable {
                        scoreboard.right += 1;
                        scoreboard.start = false;
                        ball_transform.translation.x = 0.0;
                        ball_transform.translation.y = 0.0;
                    }
                    scoreboard.turn.switch();
                }
                Collision::Top => reflect_y = ball_velocity.y < 0.0,
                Collision::Bottom => reflect_y = ball_velocity.y > 0.0,
                Collision::Inside => {}
            }

            // reflect velocity on the x-axis if we hit something on the x-axis
            if reflect_x {
                ball_velocity.x = -ball_velocity.x;
            }

            // reflect velocity on the y-axis if we hit something on the y-axis
            if reflect_y {
                ball_velocity.y = -ball_velocity.y;
            }
        }
    }
}
