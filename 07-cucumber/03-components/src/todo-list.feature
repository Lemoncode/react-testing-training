Feature: Todo list

  Scenario: Provide TODO list
    Given Todo list currently looks as follows:
      | name        | isDone |
      | Buy milk    | false  |
      | Buy coffee  | false  |
      | Buy cookies | false  |
    When I render the TodoListComponent
    Then I should see the following TODO list:
      | name        | isDone |
      | Buy milk    | false  |
      | Buy coffee  | false  |
      | Buy cookies | false  |

  Scenario Outline: Update TODO status from <initialIsDone> to <isDone>
    Given Todo list currently looks as follows:
      | name        | isDone          |
      | Buy milk    | false           |
      | Buy coffee  | <initialIsDone> |
      | Buy cookies | false           |
    When I render the TodoListComponent
    And I click on Buy coffee element
    Then I should see the following TODO list:
      | name        | isDone   |
      | Buy milk    | false    |
      | Buy coffee  | <isDone> |
      | Buy cookies | false    |

    Examples:
      | initialIsDone | isDone |
      | false         | true   |
      | true          | false  |

