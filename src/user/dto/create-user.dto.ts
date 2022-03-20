import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiModelProperty({
      example: 'SONNH',
      description: 'The name of the User',
      format: 'string',
      minLength: 5,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly fullName: string;

    @ApiModelProperty({
      example: 'edwconan100@gmail.com',
      description: 'The email of the User',
      format: 'email',
      uniqueItems: true,
      minLength: 5,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    readonly email: string;

    @ApiModelProperty({
      example: 'secret_password',
      description: 'The password of the User',
      format: 'string',
      minLength: 5,
      maxLength: 100,
    })
    @ApiModelProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    readonly password: string;
  }
