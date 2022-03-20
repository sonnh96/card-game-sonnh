import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class BattleRequestDto {

  @ApiModelProperty({
    example: '62379f4fe689d8795ac5764d',
    description: 'The id of the Card',
    format: 'string',
    minLength: 5,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly card_a: string;

  @ApiModelProperty({
    example: '62379f4fe689d8795ac5764d',
    description: 'The id of the Card',
    format: 'string',
    minLength: 5,
    maxLength: 100,
  })
  @ApiModelProperty()
  @IsNotEmpty()
  readonly card_d: string;
}
