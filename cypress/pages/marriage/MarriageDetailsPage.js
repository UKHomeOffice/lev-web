'use strict';

const DetailsPage = require('../DetailsPage');

class MarriageDetailsPage extends DetailsPage {

  /**
   * Check marriage registrations details page is visible
   */
  static shouldBeVisible() {
    cy.url().should('include', '/marriage/details');
  }

  /**
   * Check marriage registrations details page has the expected result
   */
  static hasExpectedTitle(record) {
    const { bride, groom } = record;
    cy.get('h1').contains(`${bride.forenames} ${bride.surname} & ${groom.forenames} ${groom.surname}`);
  }
}

module.exports = MarriageDetailsPage;
