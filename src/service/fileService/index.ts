import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor() {}

  uploadFile = () => {
    throw new BadRequestException('错误');
  };
}
