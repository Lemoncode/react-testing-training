import React from 'react';
import { render, screen } from '@testing-library/react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import * as api from './name-api';
import { NameCollection } from './name-collection';

const feature = loadFeature('./src/name-collection.feature');

defineFeature(feature, (scenario) => {
  scenario(
    'Display user name collection from server',
    ({ given, when, then }) => {
      given('A NameCollection Component with empty name collection', () => {
        // We need create stub before render component
      });

      when('I fetch user name collection from server', () => {
        // Nothing to do. Fetch api on component mount
      });

      then(
        'I should see list with following names:',
        async (userList: any[]) => {
          const nameList = userList.map((user) => user.name);
          const getNameCollectionStub = jest
            .spyOn(api, 'getNameCollection')
            .mockResolvedValue(nameList);

          render(<NameCollection />);
          expect(screen.queryAllByRole('listitem')).toHaveLength(0);

          const itemList = await screen.findAllByRole('listitem');

          expect(getNameCollectionStub).toHaveBeenCalled();
          expect(itemList).toHaveLength(nameList.length);
        }
      );
    }
  );
});
