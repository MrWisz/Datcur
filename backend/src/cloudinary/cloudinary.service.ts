import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import * as dotenv from 'dotenv';

// ✅ Cargar variables de entorno
dotenv.config();

// ✅ Configurar cloudinary con CLOUDINARY_URL
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL?.split('@')[1],
  api_key: process.env.CLOUDINARY_URL?.split('//')[1].split(':')[0],
  api_secret: process.env.CLOUDINARY_URL?.split(':')[2].split('@')[0],
  secure: true,
});

@Injectable()
export class CloudinaryService {
  async uploadImage(imagePathOrUrl: string, publicId?: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(imagePathOrUrl, {
        public_id: publicId ?? undefined,
        folder: 'profile_pics',
      });
      return result.secure_url;
    } catch (error) {
      console.error('❌ Error al subir imagen a Cloudinary:', error);
      throw new Error('No se pudo subir la imagen.');
    }
  }

  async uploadImageFromBuffer(buffer: Buffer, publicId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId ?? undefined,
          folder: 'profile_pics',
          resource_type: 'image',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            console.error('❌ Error al subir imagen desde buffer:', error);
            return reject(new Error('No se pudo subir la imagen desde buffer'));
          }
          resolve(result.secure_url);
        }
      );

      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  getOptimizedUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  getCroppedUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });
  }
}
