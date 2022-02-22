'use strict';

// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Populate the environment from process.env
  config.env.env = process.env.ENV;
  config.env.keycloakUrl = 'https://sso-dev.notprod.homeoffice.gov.uk';
  config.env.url = process.env.TEST_URL;
  config.env.username = process.env.TEST_USERNAME;
  config.env.password = process.env.TEST_PASSWORD;
  return config;
};
