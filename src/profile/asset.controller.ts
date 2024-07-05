import { Controller, Get, Res, Param } from '@nestjs/common';
import { Public } from './decorator/public.decorator';

@Controller('uploads')
export class AssetsController {
  @Get(':imgpath')
  @Public()
  seeUploadedFile(@Param('imgpath') image, @Res() res): void {
    return res.sendFile(image, { root: './uploads' });
  }
}
