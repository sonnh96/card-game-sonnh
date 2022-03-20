import { IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetQueryDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @ApiModelProperty({
      example: 0,
      description: 'page',
      format: 'number',
      default: 1
    })
    @IsOptional()
    from?: number;

    @ApiModelProperty({
      example: 10,
      description: 'page size',
      format: 'number',
      default: 10
    })
    @IsOptional()
    limit?: number;
}
