import { Body, Controller, Post, InternalServerErrorException } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { FileDto } from '@/dto/fileDto';
// import { BaseTransformResponse } from '@/utils/response-transformer.interceptor';
// import { LoginDto } from '@/dto/userDto';

@Controller('files')
class FilesController {
  constructor() {}

  @Post('files')
  @ApiOperation({ summary: '单个文件上传' })
  @ApiBody({
    description: '单个文件上传',
  })
  uploadFile(@Body() fileDto: FileDto) {
    try {
      return '文件上传成功';
    } catch {
      throw new InternalServerErrorException('文件上传失败');
    }
  }
}

export default new FilesController();
