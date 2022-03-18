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

  static visitWithFullDetails(search, record, multipleResults = false) {
    const qs = {
      surname: search.surname,
      forenames: search.forenames,
      dom: search.dom
    };

    // Refresh with "full-details" role
    cy.visit(`/death/details/${record.id}`, {
      headers: {
        'X-Auth-Roles': 'full-details'
      },
      qs: multipleResults ? { ...qs, multipleResults } : qs
    });
  }

  /**
   * Check death registrations details page has the expected data
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
   * Check death registrations details page has the expected data
   */
  static hasCompleteRecord(record) {
    const { deceased, informant, registrar } = record;
    const rows = [
      `System number ${record.id}`,

      'Deceased',
      `Name ${deceased.forenames} ${deceased.surname}`,
      `Maiden name ${deceased.maidenSurname}`,
      `Date of birth ${deceased.dateOfBirth}`,
      `Place of birth ${deceased.birthplace}`,
      `Sex ${deceased.sex}`,
      `Address ${deceased.address}`,
      `Occupation ${deceased.occupation}`,
      `Date of death ${deceased.dateOfDeath}`,
      `Place of death ${deceased.deathplace}`,
      `Age at death ${deceased.ageAtDeath}`,
      `Cause of death ${deceased.causeOfDeath}`,
      `Death certified by ${deceased.certifiedBy}`,

      'Informant',
      `Surname ${informant.surname}`,
      `Forename(s) ${informant.forenames}`,
      `Address ${informant.address}`,
      `Qualification ${informant.qualification}`,
      `Signature ${informant.signature}`,

      'Registration',
      `Registrar signature ${registrar.signature}`,
      `Registrar designation ${registrar.designation}`,
      `Sub-district ${registrar.subdistrict}`,
      `District ${registrar.district}`,
      `Administrative area ${registrar.administrativeArea}`,
      `Date of registration ${record.date}`,
      `Entry number ${record.entryNumber}`
    ];

    this.hasExpectedRows(rows);
  }
}

module.exports = MarriageDetailsPage;
