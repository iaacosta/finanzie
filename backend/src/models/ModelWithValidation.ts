import { BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject } from 'class-validator';
import ValidationErrors from '../graphql/errors/ValidationErrors';

export default class ModelWithValidation {
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    try {
      await validateOrReject(this);
    } catch (validationErrors) {
      throw new ValidationErrors(
        this.constructor.name.toLowerCase(),
        validationErrors,
      );
    }
  }
}
