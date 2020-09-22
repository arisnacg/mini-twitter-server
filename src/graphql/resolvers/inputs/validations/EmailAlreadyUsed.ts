import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator"
import { User } from "../../../entities/User"

@ValidatorConstraint({ async: true })
export class EmailAlreadyUsedConstraint
  implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    return User.findOne({ email: email }).then((user: any) => {
      if (user) return false
      return true
    })
  }
}

export function EmailAlreadyUsed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailAlreadyUsedConstraint,
    })
  }
}
