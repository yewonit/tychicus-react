// AWS S3 파일 업로드 서비스
// 실제 구현 시 AWS SDK 설치 필요: npm install aws-sdk

export interface S3UploadResult {
  fileName: string;
  filePath: string;
}

export const fileService = {
  /**
   * AWS S3 설정
   */
  configureS3() {
    // 실제 구현 시 AWS SDK 사용
    // AWS.config.update({
    //   accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    //   region: process.env.REACT_APP_AWS_REGION || 'ap-northeast-2',
    // });

    // eslint-disable-next-line no-console
    console.log('S3 설정 완료');
  },

  /**
   * S3에 파일 업로드 (시뮬레이션)
   */
  async uploadToS3(
    fileName: string,
    fileObject: File
  ): Promise<S3UploadResult> {
    try {
      this.configureS3();

      // eslint-disable-next-line no-console
      console.log(`S3 업로드 시작: ${fileName}`);

      // 실제 구현 시 AWS SDK 사용
      // const s3 = new AWS.S3();
      // const params = {
      //   Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      //   Key: fileName,
      //   Body: fileObject,
      //   ACL: 'public-read',
      // };
      // const result = await s3.upload(params).promise();

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        fileName: fileName,
        filePath: `https://s3.ap-northeast-2.amazonaws.com/bucket/${fileName}`,
      };

      // eslint-disable-next-line no-console
      console.log('S3 업로드 완료:', result);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('S3 업로드 실패:', error);
      throw error;
    }
  },

  /**
   * S3에서 파일 삭제 (기존 이미지 교체 시)
   */
  async deleteFromS3(fileName: string): Promise<boolean> {
    try {
      this.configureS3();

      // eslint-disable-next-line no-console
      console.log(`S3 파일 삭제 시작: ${fileName}`);

      // 실제 구현 시 AWS SDK 사용
      // const s3 = new AWS.S3();
      // const params = {
      //   Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      //   Key: fileName,
      // };
      // await s3.deleteObject(params).promise();

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      // eslint-disable-next-line no-console
      console.log('S3 파일 삭제 완료:', fileName);
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('S3 파일 삭제 실패:', error);
      throw error;
    }
  },

  /**
   * 이미지 압축
   */
  async compressImage(file: File, maxSizeMB: number = 3): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // 초기 품질 설정
          let quality = 0.7;
          const maxSize = maxSizeMB * 1024 * 1024;

          // 이미지 크기 조정
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 720;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const compressAndCheck = (currentQuality: number) => {
            const dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
            const binaryData = atob(dataUrl.split(',')[1]);
            const currentSize = binaryData.length;

            if (currentSize > maxSize && currentQuality > 0.1) {
              const newQuality =
                currentQuality > 0.5
                  ? currentQuality - 0.2
                  : currentQuality - 0.1;
              compressAndCheck(Math.max(0.1, newQuality));
            } else {
              const byteArray = new Uint8Array(binaryData.length);
              for (let i = 0; i < binaryData.length; i++) {
                byteArray[i] = binaryData.charCodeAt(i);
              }
              const blob = new Blob([byteArray], { type: 'image/jpeg' });
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: new Date().getTime(),
              });
              resolve(compressedFile);
            }
          };

          compressAndCheck(quality);
        };

        img.onerror = error => {
          reject(error);
        };
      };

      reader.onerror = error => {
        reject(error);
      };
    });
  },
};
