import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetUserCardsDto {
  @ApiModelProperty({
    example: 'sonnh@gmail.com',
    description: 'The email of the user',
    format: 'email',
    uniqueItems: true,
    minLength: 10,
    maxLength: 255,
  })
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;
}
