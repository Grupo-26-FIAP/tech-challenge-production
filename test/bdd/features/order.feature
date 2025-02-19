Feature: Order Management

  Scenario: Retrieve an order by ID
    Given the system is running
    When I access the find order route with orderId 1
    Then the system should return the order with the expected details and HTTP code 200