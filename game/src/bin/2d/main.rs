//! A simplified implementation of the classic game "Breakout".

use bevy::{
    prelude::*,
    render::render_resource::AsBindGroupShaderType,
    sprite::collide_aabb::{collide, Collision},
    sprite::MaterialMesh2dBundle,
};

// These constants are defined in `Transform` units.
// Using the default 2D camera they correspond 1:1 with screen pixels.
const PADDLE_SIZE: Vec3 = Vec3::new(20.0, 120.0, 0.0);
const GAP_BETWEEN_PADDLE_AND_FLOOR: f32 = 60.0;
const PADDLE_SPEED: f32 = 500.0;
// How close can the paddle get to the wall
const PADDLE_PADDING: f32 = 10.0;

// We set the z-value of the ball to 1 so it renders on top in the case of overlapping sprites.
const BALL_STARTING_POSITION: Vec3 = Vec3::new(0.0, -50.0, 1.0);
const BALL_SIZE: Vec3 = Vec3::new(20.0, 20.0, 0.0);
const BALL_SPEED: f32 = 400.0;
const INITIAL_BALL_DIRECTION: Vec2 = Vec2::new(0.5, -0.5);

const WALL_THICKNESS: f32 = 10.0;
// x coordinates
const LEFT_WALL: f32 = -450.;
const RIGHT_WALL: f32 = 450.;
// y coordinates
const BOTTOM_WALL: f32 = -300.;
const TOP_WALL: f32 = 300.;

const SCOREBOARD_FONT_SIZE: f32 = 40.0;
const SCOREBOARD_TEXT_PADDING: Val = Val::Px(5.0);

const BACKGROUND_COLOR: Color = Color::rgb(0.9, 0.9, 0.9);
const PADDLE_COLOR: Color = Color::rgb(0.3, 0.3, 0.7);
const BALL_COLOR: Color = Color::rgb(1.0, 0.5, 0.5);
const WALL_COLOR: Color = Color::rgb(0.8, 0.8, 0.8);
const TEXT_COLOR: Color = Color::rgb(0.5, 0.5, 1.0);
const SCORE_COLOR: Color = Color::rgb(1.0, 0.5, 0.5);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "Ping Pong".to_string(),
                // resolution: (1008.0, 567.0).into(),
                ..default()
            }),
            ..default()
        }))
        .insert_resource(Scoreboard {
            left: 0,
            right: 0,
            turn: PaddleSide::Right,
            start: false,
        })
        .insert_resource(ClearColor(BACKGROUND_COLOR))
        .add_event::<CollisionEvent>()
        // Configure how frequently our gameplay systems are run
        .insert_resource(FixedTime::new_from_secs(1.0 / 60.0))
        .add_systems(Startup, setup)
        // Add our gameplay simulation systems to the fixed timestep schedule
        .add_systems(
            FixedUpdate,
            (
                check_for_collisions,
                apply_velocity.before(check_for_collisions),
                move_paddle
                    .before(check_for_collisions)
                    .after(apply_velocity),
                //play_collision_sound.after(check_for_collisions),
            )
                .run_if(game_starts),
        )
        .add_systems(Update, start_game)
        .add_systems(Update, (update_scoreboard, bevy::window::close_on_esc))
        .run();
}
enum PaddleSide {
    Left,
    Right,
}

impl PaddleSide {
    fn switch(&mut self) {
        *self = match self {
            PaddleSide::Left => PaddleSide::Right,
            PaddleSide::Right => PaddleSide::Left,
        };
    }

    fn is(&self, _side: &PaddleSide) -> bool {
        //matches!(self, _side)
        std::mem::discriminant(self) == std::mem::discriminant(_side)
    }

    /* fn to_str(&self) -> String {
        match self {
            PaddleSide::Left => "Left".to_string(),
            PaddleSide::Right => "Right".to_string(),
        }
    } */
}

#[derive(Component)]
struct Paddle {
    side: PaddleSide,
}

#[derive(Component)]
struct Ball;

#[derive(Component, Deref, DerefMut)]
struct Velocity(Vec2);

#[derive(Component)]
struct Collider {
    scorable: bool,
}

#[derive(Event, Default)]
struct CollisionEvent;

#[derive(Component)]
struct Brick;

#[derive(Resource)]
struct CollisionSound(Handle<AudioSource>);

// This bundle is a collection of the components that define a "wall" in our game
#[derive(Bundle)]
struct WallBundle {
    // You can nest bundles inside of other bundles like this
    // Allowing you to compose their functionality
    sprite_bundle: SpriteBundle,
    collider: Collider,
}

/// Which side of the arena is this wall located on?
enum WallLocation {
    Left,
    Right,
    Bottom,
    Top,
}

impl WallLocation {
    fn position(&self) -> Vec2 {
        match self {
            WallLocation::Left => Vec2::new(LEFT_WALL, 0.),
            WallLocation::Right => Vec2::new(RIGHT_WALL, 0.),
            WallLocation::Bottom => Vec2::new(0., BOTTOM_WALL),
            WallLocation::Top => Vec2::new(0., TOP_WALL),
        }
    }

    fn size(&self) -> Vec2 {
        let arena_height = TOP_WALL - BOTTOM_WALL;
        let arena_width = RIGHT_WALL - LEFT_WALL;
        // Make sure we haven't messed up our constants
        assert!(arena_height > 0.0);
        assert!(arena_width > 0.0);

        match self {
            WallLocation::Left | WallLocation::Right => {
                Vec2::new(WALL_THICKNESS, arena_height + WALL_THICKNESS)
            }
            WallLocation::Bottom | WallLocation::Top => {
                Vec2::new(arena_width + WALL_THICKNESS, WALL_THICKNESS)
            }
        }
    }
}

impl WallBundle {
    // This "builder method" allows us to reuse logic across our wall entities,
    // making our code easier to read and less prone to bugs when we change the logic
    fn new(location: WallLocation) -> WallBundle {
        WallBundle {
            sprite_bundle: SpriteBundle {
                transform: Transform {
                    // We need to convert our Vec2 into a Vec3, by giving it a z-coordinate
                    // This is used to determine the order of our sprites
                    translation: location.position().extend(0.0),
                    // The z-scale of 2D objects must always be 1.0,
                    // or their ordering will be affected in surprising ways.
                    // See https://github.com/bevyengine/bevy/issues/4149
                    scale: location.size().extend(1.0),
                    ..default()
                },
                sprite: Sprite {
                    color: WALL_COLOR,
                    ..default()
                },
                ..default()
            },
            collider: Collider { scorable: true },
        }
    }
}

// This resource tracks the game's score
#[derive(Resource)]
struct Scoreboard {
    left: u32,
    right: u32,
    turn: PaddleSide,
    start: bool,
}

// Add the game's entities to our world
fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
    asset_server: Res<AssetServer>,
) {
    // Camera
    commands.spawn(Camera2dBundle::default());

    // Sound
    //let ball_collision_sound = asset_server.load("sounds/breakout_collision.ogg");
    //commands.insert_resource(CollisionSound(ball_collision_sound));

    // Paddle
    let paddle_x = RIGHT_WALL - GAP_BETWEEN_PADDLE_AND_FLOOR;
    commands.spawn((
        SpriteBundle {
            transform: Transform {
                translation: Vec3::new(-paddle_x, 0.0, 0.0),
                scale: PADDLE_SIZE,
                ..default()
            },
            sprite: Sprite {
                color: PADDLE_COLOR,
                ..default()
            },
            ..default()
        },
        Paddle {
            side: PaddleSide::Left,
        },
        Collider { scorable: false },
    ));

    commands.spawn((
        SpriteBundle {
            transform: Transform {
                translation: Vec3::new(paddle_x, 0.0, 0.0),
                scale: PADDLE_SIZE,
                ..default()
            },
            sprite: Sprite {
                color: PADDLE_COLOR,
                ..default()
            },
            ..default()
        },
        Paddle {
            side: PaddleSide::Right,
        },
        Collider { scorable: false },
    ));

    // Ball
    commands.spawn((
        MaterialMesh2dBundle {
            mesh: meshes.add(shape::Circle::default().into()).into(),
            material: materials.add(ColorMaterial::from(BALL_COLOR)),
            transform: Transform::from_translation(BALL_STARTING_POSITION).with_scale(BALL_SIZE),
            ..default()
        },
        Ball,
        Velocity(INITIAL_BALL_DIRECTION.normalize() * BALL_SPEED),
    ));

    // Scoreboard
    commands.spawn(
        TextBundle::from_sections([
            TextSection::new(
                "Left: ",
                TextStyle {
                    font_size: SCOREBOARD_FONT_SIZE,
                    color: TEXT_COLOR,
                    ..default()
                },
            ),
            TextSection::from_style(TextStyle {
                font_size: SCOREBOARD_FONT_SIZE,
                color: SCORE_COLOR,
                ..default()
            }),
            TextSection::new(
                "Right: ",
                TextStyle {
                    font_size: SCOREBOARD_FONT_SIZE,
                    color: TEXT_COLOR,
                    ..default()
                },
            ),
            TextSection::from_style(TextStyle {
                font_size: SCOREBOARD_FONT_SIZE,
                color: SCORE_COLOR,
                ..default()
            }),
        ])
        .with_style(Style {
            position_type: PositionType::Absolute,
            top: SCOREBOARD_TEXT_PADDING,
            left: SCOREBOARD_TEXT_PADDING,
            ..default()
        }),
    );

    // Walls
    commands.spawn(WallBundle::new(WallLocation::Left));
    commands.spawn(WallBundle::new(WallLocation::Right));
    commands.spawn(WallBundle::new(WallLocation::Bottom));
    commands.spawn(WallBundle::new(WallLocation::Top));
}

fn game_starts(score: Res<Scoreboard>) -> bool {
    score.start
}

fn start_game(keyboard_input: Res<Input<KeyCode>>, mut scoreboard: ResMut<Scoreboard>) {
    if keyboard_input.just_pressed(KeyCode::Space) && !scoreboard.start {
        scoreboard.start = true;
    }
}

fn move_paddle(
    keyboard_input: Res<Input<KeyCode>>,
    scoreboard: Res<Scoreboard>,
    mut query: Query<(&Paddle, &mut Transform), With<Paddle>>,
    time_step: Res<FixedTime>,
) {
    let a = &scoreboard.turn;
    let paddle_transform = query.iter_mut().find(|it| it.0.side.is(a));

    if let Some((_, mut paddle_transform)) = paddle_transform {
        let mut direction = 0.0;

        if keyboard_input.pressed(KeyCode::Down) {
            direction -= 1.0;
        }

        if keyboard_input.pressed(KeyCode::Up) {
            direction += 1.0;
        }

        // Calculate the new horizontal paddle position based on player input
        let new_paddle_position = paddle_transform.translation.y
            + direction * PADDLE_SPEED * time_step.period.as_secs_f32();

        // Update the paddle position,
        // making sure it doesn't cause the paddle to leave the arena
        let up_bound = -TOP_WALL + WALL_THICKNESS / 2.0 + PADDLE_SIZE.y / 2.0 + PADDLE_PADDING;
        let down_bound = -BOTTOM_WALL - WALL_THICKNESS / 2.0 - PADDLE_SIZE.y / 2.0 - PADDLE_PADDING;

        paddle_transform.translation.y = new_paddle_position.clamp(up_bound, down_bound);
    }
}

fn apply_velocity(mut query: Query<(&mut Transform, &Velocity)>, time_step: Res<FixedTime>) {
    for (mut transform, velocity) in &mut query {
        transform.translation.x += velocity.x * time_step.period.as_secs_f32();
        transform.translation.y += velocity.y * time_step.period.as_secs_f32();
    }
}

fn update_scoreboard(scoreboard: Res<Scoreboard>, mut query: Query<&mut Text>) {
    let mut text = query.single_mut();
    text.sections[1].value = scoreboard.left.to_string();
    text.sections[3].value = scoreboard.right.to_string();
}

fn check_for_collisions(
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
                Collision::Inside => { /* do nothing */ }
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
