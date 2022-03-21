'use strict';

const DetailsPage = require('../DetailsPage');

class PartnershipDetailsPage extends DetailsPage {

  static recordSummaryDisplayed(record) {
    const p1 = record.partner1;
    const p2 = record.partner2;

    DetailsPage.shouldBeVisible();
    cy.get('h1').contains(`${p2.forenames} ${p2.surname} & ${p1.forenames} ${p1.surname}`);
  }

  static recordDisplaysSystemNumber(record) {
    cy.get('.details tr').eq(0).contains(`System number ${record.id}`);
  }

  static recordDisplaysPartnershipDetails(record) {
    const { dateOfPartnership, placeOfPartnership } = record;

    cy.get('.details tr').eq(1).contains(`Date of civil partnership ${dateOfPartnership}`);
    cy.get('.details tr').eq(2).contains(`Place of civil partnership ${placeOfPartnership.short}`);
  }

  static recordDisplaysPersonalDetails(record) {
    const p1 = record.partner1;
    const p2 = record.partner2;

    // partner 1
    cy.get('.details tr').eq(4).contains(`Surname ${p1.surname}`);
    cy.get('.details tr').eq(5).contains(`Forename(s) ${p1.forenames}`);
    cy.get('.details tr').eq(6).contains(`Address ${p1.address}`);

    // partner 2
    cy.get('.details tr').eq(8).contains(`Surname ${p2.surname}`);
    cy.get('.details tr').eq(9).contains(`Forename(s) ${p2.forenames}`);
    cy.get('.details tr').eq(10).contains(`Address ${p2.address}`);
  }

  static recordDoesNotDisplayFullRegistration(record) {
    cy.get('.details tr').contains(`Signature ${record.witness1.forename} ${record.witness1.surname}`).should('not.exist');
    cy.get('.details tr').contains(`Signature ${record.witness2.forename} ${record.witness2.surname}`).should('not.exist');
    cy.get('.details tr').contains(`Registrar signature ${record.registrar.signature}`).should('not.exist');
  }

  static recordDoesNotDisplayFullPartner1Details(record) {
    cy.get('.details tr').contains(`Date of birth ${record.partner1.dob}`).should('not.exist');
    cy.get('.details tr').contains(`Occupation ${record.partner1.occupation} ${record.partner1.retired ? '(retired)' : ''}`).should('not.exist');
    cy.get('.details tr').contains(`Condition ${record.partner1.condition}`).should('not.exist').should('not.exist');
    cy.get('.details tr').contains(`Signature ${record.partner1.signature}`).should('not.exist').should('not.exist');

    cy.get('.details tr').contains(`Surname ${record.fatherOfPartner1.surname}`).should('not.exist');
    cy.get('.details tr').contains(`Forename(s) ${record.fatherOfPartner1.forenames}`).should('not.exist');
    cy.get('.details tr')
      .contains(`Occupation ${record.fatherOfPartner1.occupation} ${record.fatherOfPartner1.retired ? '(retired)' : ''}`).should('not.exist');
    cy.get('.details tr').contains(`Designation ${record.fatherOfPartner1.designation || ''}`).should('not.exist');
    cy.get('.details tr').contains(`Deceased ${record.fatherOfPartner1.deceased ? 'Yes' : 'No'}`).should('not.exist');
    cy.get('.details tr').contains(`Surname ${record.motherOfPartner1.surname}`).should('not.exist');
    cy.get('.details tr').contains(`Forename(s) ${record.motherOfPartner1.forenames}`).should('not.exist');
    cy.get('.details tr')
      .contains(`Occupation ${record.motherOfPartner1.occupation} ${record.motherOfPartner1.retired ? '(retired)' : ''}`).should('not.exist');
    cy.get('.details tr').contains(`Designation ${record.motherOfPartner1.designation || ''}`).should('not.exist');
    cy.get('.details tr').contains(`Deceased ${record.motherOfPartner1.deceased ? 'Yes' : 'No'}`).should('not.exist');

  }

  static recordDoesNotDisplayFullPartner2Details(record) {
    cy.get('.details tr').contains(`Date of birth ${record.partner2.dob}`).should('not.exist').should('not.exist');
    cy.get('.details tr').contains(`Occupation ${record.partner2.occupation} ${record.partner2.retired ? '(retired)' : ''}`).should('not.exist');
    cy.get('.details tr').contains(`Condition ${record.partner2.condition}`).should('not.exist');
    cy.get('.details tr').contains(`Signature ${record.partner2.signature}`).should('not.exist');

    cy.get('.details tr').contains(`Surname ${record.fatherOfPartner2.surname}`).should('not.exist');
    cy.get('.details tr').contains(`Forename(s) ${record.fatherOfPartner2.forenames}`).should('not.exist');
    cy.get('.details tr')
      .contains(`Occupation ${record.fatherOfPartner2.occupation} ${record.fatherOfPartner2.retired ? '(retired)' : ''}`).should('not.exist');
    cy.get('.details tr').contains(`Designation ${record.fatherOfPartner2.designation || ''}`).should('not.exist');
    cy.get('.details tr').contains(`Deceased ${record.fatherOfPartner2.deceased ? 'Yes' : 'No'}`).should('not.exist');
    cy.get('.details tr').contains(`Surname ${record.motherOfPartner2.surname}`).should('not.exist');
    cy.get('.details tr').contains(`Forename(s) ${record.motherOfPartner2.forenames}`).should('not.exist');
    cy.get('.details tr')
      .contains(`Occupation ${record.motherOfPartner2.occupation} ${record.motherOfPartner2.retired ? '(retired)' : ''}`).should('not.exist');
    cy.get('.details tr').contains(`Designation ${record.motherOfPartner2.designation || ''}`).should('not.exist');
    cy.get('.details tr').contains(`Deceased ${record.motherOfPartner2.deceased ? 'Yes' : 'No'}`).should('not.exist');
  }

  static searchWithFullDetailsRole(search, record, multipleResults = false) {
    const qs = {
      surname: search.surname,
      forenames: search.forenames,
      dop: search.dop
    };

    // Refresh with "full-details" role
    cy.visit(`/partnership/details/${record.id}`, {
      headers: {
        'X-Auth-Roles': 'full-details'
      },
      qs: multipleResults ? { ...qs, multipleResults } : qs
    });
  }

  static registrationDetailsDisplayed(record) {
    cy.get('.details tr').eq(0).contains(`System number ${record.id}`);
    cy.get('.details tr').eq(1).contains(`Date of civil partnership ${record.dateOfPartnership}`);
    cy.get('.details tr').eq(2).contains(`Place of civil partnership ${record.placeOfPartnership.short}`);

    cy.get('.details tr').eq(44).contains(`Signature ${record.witness1.forename} ${record.witness1.surname}`);
    cy.get('.details tr').eq(46).contains(`Signature ${record.witness2.forename} ${record.witness2.surname}`);
    cy.get('.details tr').eq(48).contains(`Registrar signature ${record.registrar.signature}`);
  }

  static showsPartner1Details(record) {
    cy.get('.details tr').eq(4).contains(`Surname ${record.partner1.surname}`);
    cy.get('.details tr').eq(5).contains(`Forename(s) ${record.partner1.forenames}`);
    cy.get('.details tr').eq(6).contains(`Date of birth ${record.partner1.dob}`);
    cy.get('.details tr').eq(7)
      .contains(`Occupation ${record.partner1.occupation} ${record.partner1.retired ? '(retired)' : ''}`);
    cy.get('.details tr').eq(8).contains(`Address ${record.partner1.address}`);
    cy.get('.details tr').eq(9).contains(`Condition ${record.partner1.condition}`);
    cy.get('.details tr').eq(10).contains(`Signature ${record.partner1.signature}`);
  }

  static showsPartner2Details(record) {
    cy.get('.details tr').eq(12).contains(`Surname ${record.partner2.surname}`);
    cy.get('.details tr').eq(13).contains(`Forename(s) ${record.partner2.forenames}`);
    cy.get('.details tr').eq(14).contains(`Date of birth ${record.partner2.dob}`);
    cy.get('.details tr').eq(15)
      .contains(`Occupation ${record.partner2.occupation} ${record.partner2.retired ? '(retired)' : ''}`);
    cy.get('.details tr').eq(16).contains(`Address ${record.partner2.address}`);
    cy.get('.details tr').eq(17).contains(`Condition ${record.partner2.condition}`);
    cy.get('.details tr').eq(18).contains(`Signature ${record.partner2.signature}`);
  }

  static showsPartner1ParentDetails(record) {
    cy.get('.details tr').eq(20).contains(`Surname ${record.fatherOfPartner1.surname}`);
    cy.get('.details tr').eq(21).contains(`Forename(s) ${record.fatherOfPartner1.forenames}`);
    cy.get('.details tr').eq(22)
      .contains(`Occupation ${record.fatherOfPartner1.occupation} ${record.fatherOfPartner1.retired ? '(retired)' : ''}`);
    cy.get('.details tr').eq(23).contains(`Designation ${record.fatherOfPartner1.designation || ''}`);
    cy.get('.details tr').eq(24).contains(`Deceased ${record.fatherOfPartner1.deceased ? 'Yes' : 'No'}`);
    cy.get('.details tr').eq(26).contains(`Surname ${record.motherOfPartner1.surname}`);
    cy.get('.details tr').eq(27).contains(`Forename(s) ${record.motherOfPartner1.forenames}`);
    cy.get('.details tr').eq(28)
      .contains(`Occupation ${record.motherOfPartner1.occupation} ${record.motherOfPartner1.retired ? '(retired)' : ''}`);
    cy.get('.details tr').eq(29).contains(`Designation ${record.motherOfPartner1.designation || ''}`);
    cy.get('.details tr').eq(30).contains(`Deceased ${record.motherOfPartner1.deceased ? 'Yes' : 'No'}`);
  }

  static showsPartner2ParentDetails(record) {
    cy.get('.details tr').eq(32).contains(`Surname ${record.fatherOfPartner2.surname}`);
    cy.get('.details tr').eq(33).contains(`Forename(s) ${record.fatherOfPartner2.forenames}`);
    cy.get('.details tr').eq(34)
      .contains(`Occupation ${record.fatherOfPartner2.occupation} ${record.fatherOfPartner2.retired ? '(retired)' : ''}`);
    cy.get('.details tr').eq(35).contains(`Designation ${record.fatherOfPartner2.designation || ''}`);
    cy.get('.details tr').eq(36).contains(`Deceased ${record.fatherOfPartner2.deceased ? 'Yes' : 'No'}`);
    cy.get('.details tr').eq(38).contains(`Surname ${record.motherOfPartner2.surname}`);
    cy.get('.details tr').eq(39).contains(`Forename(s) ${record.motherOfPartner2.forenames}`);
    cy.get('.details tr').eq(40)
      .contains(`Occupation ${record.motherOfPartner2.occupation} ${record.motherOfPartner2.retired ? '(retired)' : ''}`);
    cy.get('.details tr').eq(41).contains(`Designation ${record.motherOfPartner2.designation || ''}`);
    cy.get('.details tr').eq(42).contains(`Deceased ${record.motherOfPartner2.deceased ? 'Yes' : 'No'}`);

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

module.exports = PartnershipDetailsPage;
