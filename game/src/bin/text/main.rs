use bevy::{
    prelude::*,
     sprite::Anchor,
    text::{BreakLineOn, Text2dBounds},
};

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(
            WindowPlugin {
                primary_window: Some(Window{
                    title: "Ping Pong".to_string(),
                   // resolution: (1008.0, 567.0).into(),
                    ..default()
                }),
                ..default()
            }
        ))
        .add_startup_system(setup)
        .add_system(animate_translation)
        .add_system(animate_rotation)
        .add_system(animate_scale)
        .run();
}


#[derive(Component)]
struct AnimateTranslation;

#[derive(Component)]
struct AnimateRotation;

#[derive(Component)]
struct AnimateScale;

fn setup(mut commands: Commands, asset_server: Res<AssetServer>) {
    let font = asset_server.load("fonts/sporttype.ttf");
    let text_style = TextStyle {
        font,
        font_size: 60.0,
        color: Color::WHITE,
    };
    let text_alignment = TextAlignment::Center;
    commands.spawn(Camera2dBundle::default());
    commands.spawn((
        Text2dBundle {
            text: Text::from_section("Ping Pong", text_style)
                .with_alignment(text_alignment),
            ..default()
        },
        AnimateTranslation,
    ));
}

fn animate_translation(
    time: Res<Time>,
    mut query: Query<&mut Transform, (With<Text>, With<AnimateTranslation>)>,
) {
    for mut transform in &mut query {
        transform.translation.x = 100.0 * time.elapsed_seconds().sin() ;
        transform.translation.y = 100.0 + 100.0 * time.elapsed_seconds().cos();
    }
}

fn animate_rotation(
    time: Res<Time>,
    mut query: Query<&mut Transform, (With<Text>, With<AnimateRotation>)>,
) {
    for mut transform in &mut query {
        transform.rotation = Quat::from_rotation_z(time.elapsed_seconds().cos());
    }
}

fn animate_scale(
    time: Res<Time>,
    mut query: Query<&mut Transform, (With<Text>, With<AnimateScale>)>,
) {
    // Consider changing font-size instead of scaling the transform. Scaling a Text2D will scale the
    // rendered quad, resulting in a pixellated look.
    for mut transform in &mut query {
        transform.translation = Vec3::new(400.0, 0.0, 0.0);
        transform.scale = Vec3::splat((time.elapsed_seconds().sin() + 1.1) * 2.0);
    }
}
