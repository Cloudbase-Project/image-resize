import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Utils from './utils/utils';
import { ConfigDocument } from './entities/config.entity';
import { ApplicationException } from 'src/utils/exception/ApplicationException';
import { createConfigDTO } from './dtos/createConfig.dto';
// import sharp from 'sharp';
import * as sharp from 'sharp';
import { S3 } from 'aws-sdk';

@Injectable()
export class configService {
  private readonly logger = new Logger('userService');

  constructor(
    @InjectModel('Config')
    private readonly configModel: Model<ConfigDocument>,
    public utils: Utils,
  ) {}

  async createConfig(createConfigDTO: createConfigDTO) {
    const config = await this.configModel.create({
      enabled: true,
      projectId: createConfigDTO.projectId,
      owner: createConfigDTO.owner,
    });

    return config;
  }

  async toggleService(projectId: string, ownerId: string) {
    const config = await this.configModel.findOne({
      projectId: projectId,
      owner: ownerId,
    });
    if (!config) {
      throw new ApplicationException('invalid projectid', 400);
    }
    config.enabled = !config.enabled;
    await config.save();
    return config;
  }

  async resizeImage(file: Express.Multer.File, height: number, width: number) {
    height = Number(height);
    width = Number(width);
    console.log('reached function : ', file, height);
    console.log('SHARP : ', sharp);
    // const z = sharp().resize(width, height);
    // file.stream.pipe(z);
    // console.log('z : ', z);
    const x = await sharp(file.buffer).resize(width, height).toBuffer();
    console.log('X : ', x);
    const s3 = new S3();
    console.log('S3 initialized');
    const s = s3.upload({
      Bucket: process.env.BUCKET,
      Key: file.originalname,
      Body: x,
    });
    console.log('Created config');
    await s.promise();
    console.log('promissed ');

    return { message: 'resized image and uploaded successfully' };
  }
}
