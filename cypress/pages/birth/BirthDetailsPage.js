'use strict';

const DetailsPage = require('../DetailsPage');

class BirthDetailsPage extends DetailsPage {

  static recordSummaryDisplayed(record) {
    DetailsPage.shouldBeVisible();
    cy.get('h1').contains(`${record.child.name.fullName} ${record.child.dateOfBirth}`);
  }

  static recordDisplaysSystemNumber(record) {
    cy.get('.details tr').eq(0).contains(`System number ${record.systemNumber}`);
  }

  static recordDisplaysChildDetails(record) {
    cy.get('.details tr').eq(2).contains(`Surname ${record.child.name.surname}`);
    cy.get('.details tr').eq(3).contains(`Forename(s) ${record.child.name.givenName}`);
    cy.get('.details tr').eq(4).contains(`Date of birth ${record.child.dateOfBirth}`);
    cy.get('.details tr').eq(5).contains(`Sex ${record.child.sex}`);
    cy.get('.details tr').eq(6).contains(`Place of birth ${record.child.birthplace}`);
  }

  static recordDisplaysMotherDetails(record) {
    cy.get('.details tr').eq(8).contains(`Name ${record.mother.name.fullName}`);
    cy.get('.details tr').eq(9).contains(`Maiden name ${record.mother.maidenSurname}`);
    cy.get('.details tr').eq(10)
      .contains(`Surname at marriage if different from maiden name ${record.mother.marriageSurname}`);
    cy.get('.details tr').eq(11).contains(`Place of birth ${record.mother.birthplace}`);
  }

  static recordDisplaysFatherDetails(record) {
    cy.get('.details tr').eq(13).contains(`Name ${record.father.name.fullName}`);
    cy.get('.details tr').eq(14).contains(`Place of birth ${record.father.birthplace}`);
  }

  static recordDisplaysRegistrationDetails(record) {
    cy.get('.details tr').eq(16).contains('Birth registered by Mother');
    cy.get('.details tr').eq(17).contains(`Registration district ${record.registrationDistrict}`);
    cy.get('.details tr').eq(18).contains(`Sub-district ${record.subDistrict}`);
    cy.get('.details tr').eq(19).contains(`Administrative area ${record.administrativeArea}`);
    cy.get('.details tr').eq(20).contains(`Date of registration ${record.date}`);
  }

  static clickNewSearchLink() {
    cy.get('#newSearchLink').click();
  }

  static clickEditSearchLink() {
    cy.get('#editSearchLink').click();
  }

  static clickBackToResultsLink() {
    cy.get('#backToSearchResults').click();
  }

  static editSearchLinkVisible() {
    cy.get('#editSearchLink').contains('Edit search');
  }

  static backToSearchResultsDisplayed() {
    cy.get('#backToSearchResults').should('exist');
  }

  static backToSearchResultsNotDisplayed() {
    cy.get('#backToSearchResults').should('not.exist');
  }
}

module.exports = BirthDetailsPage;
