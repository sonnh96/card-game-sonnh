import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export class SellCardDto {

  @ApiModelProperty({
    example: 'edwconan100@gmail.com',
    description: 'The email of the Card',
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
    description: 'The password of the Card',
    format: 'string',
    minLength: 5,
    maxLength: 100,
  })
  @ApiModelProperty()
  @IsNotEmpty()
  readonly card: mongoose.Types.ObjectId;
}
