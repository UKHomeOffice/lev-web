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

  /**
   * Visit the details page with the "full-details" role
   *
   * @param search
   * @param record
   * @param multipleResults
   */
  static visitWithFullDetails(search, record, multipleResults = false) {
    const qs = {
      surname: search.surname,
      forenames: search.forenames,
      dom: search.dom
    };

    // Refresh with "full-details" role
    cy.visit(`/marriage/details/${record.id}`, {
      headers: {
        'X-Auth-Roles': 'full-details'
      },
      qs: multipleResults ? { ...qs, multipleResults } : qs
    });
  }

  /**
   * Check marriage registrations details page has the expected data
   */
  static hasLimitedRecord(record) {
    const { groom, bride, registrar } = record;
    const rows = [
      `System number ${record.id}`,
      `Date of marriage ${record.dateOfMarriage}`,
      `Place of marriage ${record.placeOfMarriage.address}`,

      'Partner 1',
      `Surname ${groom.surname}`,
      `Forename(s) ${groom.forenames}`,
      `Address ${groom.address}`,

      'Partner 2',
      `Surname ${bride.surname}`,
      `Forename(s) ${bride.forenames}`,
      `Address ${bride.address}`,

      'Registration',
      `District ${registrar.district}`,
      `Administrative area ${registrar.administrativeArea}`,
    ];

    this.hasExpectedRows(rows);
  }

  /**
   * Check marriage registrations details page has the expected data
   */
  static hasCompleteRecord(record) {
    const { groom, bride, fatherOfGroom, fatherOfBride, registrar } = record;
    const rows = [
      `System number ${record.id}`,
      `Date of marriage ${record.dateOfMarriage}`,
      `Place of marriage ${record.placeOfMarriage.address}`,

      'Partner 1',
      `Surname ${groom.surname}`,
      `Forename(s) ${groom.forenames}`,
      `Age ${groom.age}`,
      `Occupation ${groom.occupation}`,
      `Address ${groom.address}`,
      `Condition ${groom.condition}`,
      `Signature ${groom.signature}`,

      'Partner 2',
      `Surname ${bride.surname}`,
      `Forename(s) ${bride.forenames}`,
      `Age ${bride.age}`,
      `Occupation ${bride.occupation}`,
      `Address ${bride.address}`,
      `Condition ${bride.condition}`,
      `Signature ${bride.signature}`,

      'Father of partner 1',
      `Surname ${fatherOfGroom.surname}`,
      `Forename(s) ${fatherOfGroom.forenames}`,
      `Occupation ${fatherOfGroom.occupation}`,
      `Designation ${fatherOfGroom.designation || ''}`,
      `Deceased ${fatherOfGroom.deceased ? 'Yes' : 'No'}`,

      'Father of partner 2',
      `Surname ${fatherOfBride.surname}`,
      `Forename(s) ${fatherOfBride.forenames}`,
      `Occupation ${fatherOfBride.occupation}`,
      `Designation ${fatherOfBride.designation || ''}`,
      `Deceased ${fatherOfBride.deceased ? 'Yes' : 'No'}`,

      'First witness',
      `Signature ${record.witness1.signature}`,

      'Second witness',
      `Signature ${record.witness2.signature}`,

      'Registration',
      `Registrar signature ${registrar.signature}`,
      `Registrar designation ${registrar.designation}`,
      `Superintendent registrar signature ${registrar.superintendentSignature}`,
      `Superintendent registrar designation ${registrar.superintendentDesignation}`,
      `District ${registrar.district}`,
      `Administrative area ${registrar.administrativeArea}`,
      `Entry number ${record.entryNumber}`
    ];

    this.hasExpectedRows(rows);
  }
}

module.exports = MarriageDetailsPage;
