describe('Stock Data Fetcher and Backtest', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should fetch stock data and display it in the table', () => {
    cy.get('input#ticker').type('AAPL');
    cy.get('button').contains('Search').click();

    cy.get('table').should('be.visible');
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  });

  it('should display an error message if fetching stock data fails', () => {
    cy.intercept('GET', '**/stocks?ticker=INVALID', {
      statusCode: 404,
      body: { error: 'Stock not found' },
    });

    cy.get('input#ticker').type('INVALID');
    cy.get('button').contains('Search').click();

    cy.get('.toast').should('contain', 'Error fetching stock data: Stock not found');
  });

  it('should run backtest and display results', () => {
    cy.get('input#ticker').type('AAPL');
    cy.get('button').contains('Search').click();

    cy.get('input#initialInvestment').type('1000');
    cy.get('input#shortWindow').type('5');
    cy.get('input#longWindow').type('20');
    cy.get('button').contains('Run Backtest').click();

    cy.get('.backtest-results').should('be.visible');
  });

  it('should display an error message if running backtest fails', () => {
    cy.intercept('GET', '**/simplemovingaverage**', {
      statusCode: 500,
      body: { error: 'Internal server error' },
    });

    cy.get('input#ticker').type('AAPL');
    cy.get('button').contains('Search').click();

    cy.get('input#initialInvestment').type('1000');
    cy.get('input#shortWindow').type('5');
    cy.get('input#longWindow').type('20');
    cy.get('button').contains('Run Backtest').click();

    cy.get('.toast').should('contain', 'Error running backtest: Internal server error');
  });
});