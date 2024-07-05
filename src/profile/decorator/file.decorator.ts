import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsMimeType(allowedMimeTypes: string[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isMimeType',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedMimeTypes],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [allowedMimeTypes] = args.constraints;
          return value && allowedMimeTypes.includes(value.mimetype);
        },
      },
    });
  };
}