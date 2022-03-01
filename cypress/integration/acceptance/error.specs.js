'use strict';

const AuditErrorPage = require('../../pages/audit/AuditErrorPage');
const AuditSearchPage = require('../../pages/audit/AuditSearchPage');
const SearchErrorPage = require('../../pages/SearchErrorPage');
const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');

describe('Error page', () => {
  before(() => {
    LoginPage.login();
  });

  describe('shown after a birth search error', () => {
    before(() => {
      SearchErrorPage.visit('/details/404');
    });
    it('should show the error page', () => {
      SearchErrorPage.shouldBeVisible();
    });
    it('has a Start Again link which', () => {
      SearchErrorPage.shouldHaveStartAgainLink();
    });
    it('should take the user back to the Search page', () => {
      SearchErrorPage.clickStartAgainLink();
      HomePage.shouldBeVisible();
    });
  });

  describe('shown after a death search error', () => {
    before(() => {
      SearchErrorPage.visit('/death/details/404');
    });
    it('should show the error page', () => {
      SearchErrorPage.shouldBeVisible();
    });
    it('has a Start Again link which', () => {
      SearchErrorPage.shouldHaveStartAgainLink();
    });
    it('should take the user back to the Search page', () => {
      SearchErrorPage.clickStartAgainLink();
      HomePage.shouldBeVisible();
    });
  });

  describe('shown after a marriage search error', () => {
    before(() => {
      SearchErrorPage.visit('/marriage/details/404');
    });
    it('should show the error page', () => {
      SearchErrorPage.shouldBeVisible();
    });
    it('has a Start Again link which', () => {
      SearchErrorPage.shouldHaveStartAgainLink();
    });
    it('should take the user back to the Search page', () => {
      SearchErrorPage.clickStartAgainLink();
      HomePage.shouldBeVisible();
    });
  });

  describe('shown after a civil partnership search error', () => {
    before(() => {
      SearchErrorPage.visit('/partnership/details/404');
    });
    it('should show the error page', () => {
      SearchErrorPage.shouldBeVisible();
    });
    it('has a Start Again link which', () => {
      SearchErrorPage.shouldHaveStartAgainLink();
    });
    it('should take the user back to the Search page', () => {
      SearchErrorPage.clickStartAgainLink();
      HomePage.shouldBeVisible();
    });
  });

  describe('shown after an audit report search error', () => {
    before(() => {
      AuditErrorPage.visit();
    });
    it('should show the error page', () => {
      AuditErrorPage.shouldBeVisible();
    });
    it('has a Start Again link which', () => {
      AuditErrorPage.shouldHaveStartAgainLink();
    });
    it('should take the user back to the User Activity Report page', () => {
      AuditErrorPage.clickStartAgainLink();
      AuditSearchPage.shouldBeVisible();
    });
  });
});
