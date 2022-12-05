import { isArray } from 'lodash';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export enum DatabaseImportStatus {
  Success = 'success',
  Partial = 'partial',
  Fail = 'fail',
}

export class DatabaseImportResult {
  @ApiProperty({
    description: 'Entry index from original json',
    type: Number,
  })
  @Expose()
  index: number;

  @ApiProperty({
    description: 'Import status',
    enum: DatabaseImportStatus,
  })
  @Expose()
  status: DatabaseImportStatus;

  @ApiPropertyOptional({
    description: 'Database host',
    type: String,
  })
  @Expose()
  host?: string;

  @ApiPropertyOptional({
    description: 'Database port',
    type: Number,
  })
  @Expose()
  port?: number;

  @ApiPropertyOptional({
    description: 'Error message if any',
    type: String,
  })
  @Expose()
  @Transform((e) => {
    if (!e) {
      return undefined;
    }

    if (e?.response?.message) {
      return isArray(e.response.message) ? e.response.message[e.response.message.length - 1] : e.response.message;
    }

    return e?.message || 'Unhandled Error';
  }, { toPlainOnly: true })
  error?: Error;
}

export class DatabaseImportResponse {
  @ApiProperty({
    description: 'Total elements processed from the import file',
    type: Number,
  })
  @Expose()
  total: number;

  @ApiProperty({
    description: 'List of successfully imported database',
    type: DatabaseImportResult,
  })
  @Expose()
  @Type(() => DatabaseImportResult)
  success: DatabaseImportResult[];

  @ApiProperty({
    description: 'List of partially imported database',
    type: DatabaseImportResult,
  })
  @Expose()
  @Type(() => DatabaseImportResult)
  partial: DatabaseImportResult[];

  @ApiProperty({
    description: 'List of databases failed to import',
    type: DatabaseImportResult,
  })
  @Expose()
  @Type(() => DatabaseImportResult)
  fail: DatabaseImportResult[];
}
