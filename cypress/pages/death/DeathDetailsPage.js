'use strict';

const DetailsPage = require('../DetailsPage');

class DeathDetailsPage extends DetailsPage {

  /**
   * Check death registrations details page is visible
   */
  static shouldBeVisible() {
    cy.url().should('include', '/death/details');
  }

  /**
   * Check death registrations details page has the expected result
   */
  static hasExpectedTitle(record) {
    const { deceased } = record;
    cy.get('h1').contains(`${deceased.forenames} ${deceased.surname} ${deceased.dateOfBirth}`);
  }

  /**
   * Check death registrations details page has the expected data
   */
  static hasExpectedRecord(record) {
    if (Cypress.env('env') === 'dev') {
      this.hasCompleteRecord(record);
    } else {
      this.hasLimitedRecord(record);
    }
  }

  /**
   * Check death registrations details page has the expected data
   */
  static hasLimitedRecord(record) {
    const { deceased, registrar } = record;
    const rows = [
      `System number ${record.id}`,

      'Deceased',
      `Name ${deceased.forenames} ${deceased.surname}`,
      `Date of birth ${deceased.dateOfBirth}`,
      `Sex ${deceased.sex}`,
      `Address ${deceased.address}`,
      `Date of death ${deceased.dateOfDeath}`,

      'Registration',
      `Sub-district ${registrar.subdistrict}`,
      `District ${registrar.district}`,
      `Administrative area ${registrar.administrativeArea}`,
      `Date of registration ${record.date}`,
    ];

    rows.forEach((value, index) => {
      cy.get('table tr').eq(index).contains(value);
    });
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

    rows.forEach((value, index) => {
      cy.get('table tr').eq(index).contains(value);
    });
  }
}

module.exports = DeathDetailsPage;
