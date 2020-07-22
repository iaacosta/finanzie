/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to press a submit button in a form
     * @example cy.submitForm()
     */
    submitForm(): Chainable<Element>;
    /**
     * Custom command to get element by it's test id. Must use
     * 'data-testid' as attribute on the DOM
     * @example cy.findByTestId('login-submit-button')
     */
    findByTestId(testId: string): Chainable<Element>;
    /**
     * Custom command to get options of an inmediate before
     * select field opened.
     * @example cy.getSelectOptions()
     */
    getSelectOptions(): Chainable<Element>;
    /**
     * Custom command to change the option of a select field
     * component. Accepts label as an optional param
     * @example cy.changeSelectOption('preference-input')
     * @example cy.changeSelectOption('preference-input', 'Chips')
     */
    changeSelectOption(testId: string, optionLabel?: string): Chainable<Element>;
    /**
     * Custom command to attach a specific file to a platform
     * file input.
     * @example cy.attachFileByTestId('preference-input', 'sample_file.png')
     */
    attachFileByTestId(testId: string, filePath: string): Chainable<Element>;
    /**
     * Custom command to send a GraphQL request
     */
    graphQLRequest(request: { query: any; variables: { [key: string]: any } }): void;
  }
}