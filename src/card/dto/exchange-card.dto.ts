import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ExchangeCardDto {
  @ApiModelProperty({
    example: '62372daeb1d2113d0c176d5f',
    description: 'The id of the Card',
    format: 'string',
    minLength: 5,
    maxLength: 100,
  })
  @IsNotEmpty()
  readonly card: string;
}
