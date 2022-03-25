import {
  Controller,
  Get,
  HttpCode,
  Logger,
  UseGuards,
  Inject,
  Param,
  Query,
  Post,
  Body,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiHeader } from '@nestjs/swagger';
import { OwnerGuard } from './guards/ownerGuard';
import { configService } from './config.service';
import { createConfigDTO } from './dtos/createConfig.dto';
import { ValidationException } from 'src/utils/exception/ValidationException';
import { FileInterceptor } from '@nestjs/platform-express';

// @ApiHeader({ name: 'Authorization', required: true })
@Controller('config')
export class configController {
  private readonly logger = new Logger('configController');

  constructor(
    private readonly configService: configService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  // internal route
  @Post('/')
  @HttpCode(201)
  createConfig(
    @Body(
      new ValidationPipe({
        exceptionFactory: ValidationException.throwValidationException,
        forbidNonWhitelisted: true, // Add validation options here.
        whitelist: true,
      }),
    )
    createConfigDTO: createConfigDTO,
  ) {
    return this.configService.createConfig(createConfigDTO);
  }

  @Post('/:projectId')
  @HttpCode(200)
  @UseGuards(OwnerGuard)
  toggleService(@Param('projectId') projectId: string) {
    return this.configService.toggleService(projectId, this.req.ownerId);
  }

  @Post('/:projectId')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(OwnerGuard)
  resizeImage(
    @Query('height') height: number,
    @Query('width') width: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.configService.resizeImage(file, height, width);
  }
}
