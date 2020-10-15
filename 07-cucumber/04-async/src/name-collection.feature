Feature: Name collection

  Scenario: Display user name collection from server
    Given A NameCollection Component with empty name collection
    When I fetch user name collection from server
    Then I should see list with following names:
      | name       |
      | John Doe   |
      | Jane Doe   |
      | Junior Doe |

