import { loadFeature, defineFeature } from 'jest-cucumber';
import { Rocket } from './rocket';

const feature = loadFeature('./src/rocket.feature');

defineFeature(feature, (scenario) => {
  scenario('Launching a SpaceX rocket', ({ given, when, then, and }) => {
    let rocket: Rocket;

    given('I am Elon Musk attempting to launch a rocket into space', () => {
      rocket = new Rocket();
    });

    when('I launch the rocket', () => {
      rocket.launch();
    });

    then('The rocket should end up in space', () => {
      expect(rocket.isInSpace).toBeTruthy();
    });

    and('The boosters should land back on the launch pad again', () => {
      expect(rocket.boostersLanded).toBeTruthy();
    });
  });
});
