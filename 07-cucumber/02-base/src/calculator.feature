Feature: Calculator operations

  Scenario Outline: Add the numbers <firstOperand> and <secondOperand> should return <result>
    Given I have entered <firstOperand> as the first operand
    And I have entered <secondOperand> as the second operand
    When I add both numbers
    Then The result should be <result>

    Examples:
      | firstOperand | secondOperand | result |
      | 2            | 2             | 4      |
      | 2            | -6            | -4     |
      | 6            | -2            | 4      |
      | 4            | -4            | 0      |
      | -4           | -4            | -8     |

  Scenario Outline: Divide the numbers <firstOperand> and <secondOperand> should return <result>
    Given I have entered <firstOperand> as the first operand
    And I have entered <secondOperand> as the second operand
    When I divide both numbers
    Then The result should be <result>

    Examples: Successful division
      | firstOperand | secondOperand | result |
      | 4            | 2             | 2      |
      | 2            | 4             | 0.5    |
      | 4            | -2            | -2     |
      | 2            | -4            | -0.5   |
      | 0            | 2             | 0      |

    Examples: Unsuccessful division
      | firstOperand | secondOperand | result    |
      | 2            | 0             | undefined |
