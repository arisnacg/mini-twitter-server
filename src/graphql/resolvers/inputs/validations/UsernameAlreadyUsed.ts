import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator"
import { User } from "../../../entities/User"

@ValidatorConstraint({ async: true })
export class UsernameAlreadyUsedConstraint
  implements ValidatorConstraintInterface {
  validate(username: string, args: ValidationArguments) {
    return User.findOne({ username }).then((user: any) => {
      if (user) return false
      return true
    })
  }
}

export function UsernameAlreadyUsed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsernameAlreadyUsedConstraint,
    })
  }
}
